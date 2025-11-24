'use client';

import { createClient } from '@/lib/supabase/client';
import { Quiz, CreateQuizDTO } from '@/types/quiz';
import { generateGameCode } from '@/lib/utils/gameCode';

const supabase = createClient();

export const saveQuiz = async (quizData: CreateQuizDTO) => {
  try {
    // Generate a unique game code
    let gameCode: number = 0;
    let isCodeUnique = false;

    // Keep generating until we find a unique code
    while (!isCodeUnique) {
      const newCode = generateGameCode();
      const { data: existingQuiz } = await supabase
        .from('quizzes')
        .select('id')
        .eq('game_code', newCode.toString())
        .single();

      if (!existingQuiz) {
        gameCode = newCode;
        isCodeUnique = true;
      }
    }

    const quizToSave = {
      ...quizData,
      game_code: gameCode.toString(),
      questions: JSON.stringify(quizData.questions) // Store questions as JSON string
    };

    const { data, error } = await supabase
      .from('quizzes')
      .insert(quizToSave)
      .select()
      .single();

    // Parse questions back to object when returning
    if (data) {
      data.questions = JSON.parse(data.questions);
    }

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving quiz:', error);
    return { data: null, error };
  }
};

export const getQuizByCode = async (code: string) => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('game_code', code)
      .single();

    if (error) throw error;

    // Parse questions from JSON string
    if (data) {
      const parsedQuestions = JSON.parse(data.questions);
      // Normalize questions to ensure isCorrect is present (handling legacy is_correct)
      data.questions = parsedQuestions.map((q: any) => ({
        ...q,
        options: q.options.map((opt: any) => ({
          ...opt,
          isCorrect: opt.isCorrect !== undefined ? opt.isCorrect : opt.is_correct
        }))
      }));
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return { data: null, error };
  }
};

export const getUserQuizzes = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Parse questions from JSON string for each quiz
    if (data) {
      data.forEach(quiz => {
        const parsedQuestions = JSON.parse(quiz.questions);
        // Normalize questions
        quiz.questions = parsedQuestions.map((q: any) => ({
          ...q,
          options: q.options.map((opt: any) => ({
            ...opt,
            isCorrect: opt.isCorrect !== undefined ? opt.isCorrect : opt.is_correct
          }))
        }));
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    return { data: null, error };
  }
};
