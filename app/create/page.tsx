'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { saveQuiz } from '@/services/quizService';
import { Quiz, Question as QuestionType } from '@/types/quiz';
import { initTelegramWebApp, getTelegramUser, isTelegramWebApp } from '@/lib/telegram';

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  text: string;
  options: Option[];
};

type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      id: crypto.randomUUID(),
      text: '',
      options: [
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
      ],
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: '',
      options: [
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const updateQuestionText = (questionId: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, text } : q))
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: crypto.randomUUID(), text: '', isCorrect: false },
              ],
            }
          : q
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<Option>
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, ...updates } : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== optionId),
            }
          : q
      )
    );
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length <= 1) return; // Don't remove the last question
    const newQuestions = questions.filter((q) => q.id !== questionId);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(Math.min(currentQuestionIndex, newQuestions.length - 1));
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize Telegram WebApp
    const isTelegram = initTelegramWebApp();
    
    if (!isTelegram) {
      console.warn('Not running in Telegram WebApp');
      // For development, you might want to handle this case differently
      // For now, we'll continue but the user won't be able to save quizzes
      return;
    }
    
    // Get Telegram user info
    const user = getTelegramUser();
    if (user) {
      setTelegramUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url
      });
    }
    
    // Cleanup
    return () => {
      // Any cleanup if needed
    };
  }, []);
  
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }
  
  if (!isTelegramWebApp()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">
            This application must be opened from within Telegram to function properly.
          </p>
          <p className="text-sm text-gray-500">
            Please open this page from a Telegram chat or bot.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveQuiz = async () => {
    if (!telegramUser) {
      alert('Failed to get user information from Telegram');
      return;
    }

    if (!quizTitle.trim() || questions.some(q => !q.text.trim() || q.options.some(o => !o.text.trim()))) {
      alert('Please fill in all fields');
      return;
    }

    if (questions.some(q => !q.options.some(o => o.isCorrect))) {
      alert('Each question must have at least one correct answer');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await saveQuiz({
        title: quizTitle,
        is_public: isPublic,
        author_id: telegramUser.id.toString(),
        author_name: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' '),
        author_username: telegramUser.username || '',
        questions: questions.map(q => ({
          ...q,
          options: q.options.map(opt => ({
            text: opt.text,
            is_correct: opt.isCorrect
          }))
        }))
      } as any);

      if (error) throw error;
      
      setGameCode(data?.game_code);
      alert(`Quiz saved successfully! Your game code is: ${data?.game_code}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {gameCode && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Quiz Created!</strong>
            <span className="block sm:inline"> Your game code is: </span>
            <span className="font-mono font-bold text-xl">{gameCode}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(gameCode)}
              className="ml-2 px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Copy
            </button>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Create New Quiz</h1>
              {telegramUser?.photo_url && (
                <img 
                  src={telegramUser.photo_url} 
                  alt="User" 
                  className="w-10 h-10 rounded-full"
                />
              )}
            </div>
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-gray-700">Visibility:</span>
              <div className="flex items-center">
                <span className={`mr-2 ${isPublic ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Public</span>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isPublic ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`ml-2 ${!isPublic ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Private</span>
              </div>
              <span className="text-sm text-gray-500">
                {isPublic ? 'Anyone can see and take this quiz' : 'Only you can see this quiz'}
              </span>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="bg-gray-50 p-4 flex overflow-x-auto space-x-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                Q{index + 1}
              </button>
            ))}
            <button
              onClick={addNewQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Question {currentQuestionIndex + 1}
              </h2>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(currentQuestion.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Question
                </button>
              )}
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter your question"
                value={currentQuestion.text}
                onChange={(e) =>
                  updateQuestionText(currentQuestion.id, e.target.value)
                }
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`correct-answer-${currentQuestion.id}`}
                      checked={option.isCorrect}
                      onChange={() =>
                        updateOption(currentQuestion.id, option.id, {
                          isCorrect: true,
                        })
                      }
                      className="h-5 w-5 text-blue-600"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) =>
                        updateOption(currentQuestion.id, option.id, {
                          text: e.target.value,
                        })
                      }
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {currentQuestion.options.length > 2 && (
                      <button
                        onClick={() =>
                          removeOption(currentQuestion.id, option.id)
                        }
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addOption(currentQuestion.id)}
                  className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <span className="mr-1">+</span> Add Option
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSaveQuiz}
            disabled={!quizTitle.trim() || !currentQuestion.text.trim() || loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Quiz'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
