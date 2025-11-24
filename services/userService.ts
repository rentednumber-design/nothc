'use client';

import { createClient } from '@/lib/supabase/client';
import { User, CreateUserDTO, QuizResult, UserStats } from '@/types/user';

const supabase = createClient();

/**
 * Get user by ID or create if doesn't exist
 */
export const getOrCreateUser = async (userData: CreateUserDTO): Promise<{ data: User | null; error: any }> => {
    try {
        // First, try to get existing user
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userData.id)
            .single();

        // If user exists, return it
        if (existingUser && !fetchError) {
            return { data: existingUser, error: null };
        }

        // If user doesn't exist, create new one
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                id: userData.id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
                photo_url: userData.photo_url,
                language_code: userData.language_code,
                is_premium: userData.is_premium,
                rating: 0, // Start with 0 rating
            })
            .select()
            .single();

        if (createError) throw createError;
        return { data: newUser, error: null };
    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
        return { data: null, error };
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<{ data: User | null; error: any }> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { data: null, error };
    }
};

/**
 * Update user rating by adding points
 */
export const updateUserRating = async (
    userId: number,
    ratingIncrease: number
): Promise<{ data: User | null; error: any }> => {
    try {
        // First get current rating
        const { data: user, error: fetchError } = await getUserById(userId);
        if (fetchError || !user) {
            throw new Error('User not found');
        }

        const newRating = user.rating + ratingIncrease;

        // Update rating
        const { data, error } = await supabase
            .from('users')
            .update({ rating: newRating })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating user rating:', error);
        return { data: null, error };
    }
};

/**
 * Save quiz result and update user rating
 */
export const saveQuizResult = async (
    userId: number,
    quizId: string | undefined,
    score: number,
    questionsAnswered: number,
    correctAnswers: number
): Promise<{ data: QuizResult | null; error: any; ratingEarned: number }> => {
    try {
        // Calculate rating earned (score / 100, rounded down)
        const ratingEarned = Math.floor(score / 100);

        // Save quiz result
        const { data: result, error: resultError } = await supabase
            .from('quiz_results')
            .insert({
                user_id: userId,
                quiz_id: quizId,
                score,
                rating_earned: ratingEarned,
                questions_answered: questionsAnswered,
                correct_answers: correctAnswers,
            })
            .select()
            .single();

        if (resultError) throw resultError;

        // Update user rating
        const { error: ratingError } = await updateUserRating(userId, ratingEarned);
        if (ratingError) throw ratingError;

        return { data: result, error: null, ratingEarned };
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return { data: null, error, ratingEarned: 0 };
    }
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: number): Promise<{ data: UserStats | null; error: any }> => {
    try {
        const { data: results, error } = await supabase
            .from('quiz_results')
            .select('score, rating_earned')
            .eq('user_id', userId);

        if (error) throw error;

        if (!results || results.length === 0) {
            return {
                data: {
                    total_quizzes: 0,
                    total_score: 0,
                    total_rating_earned: 0,
                    average_score: 0,
                    best_score: 0,
                },
                error: null,
            };
        }

        const stats: UserStats = {
            total_quizzes: results.length,
            total_score: results.reduce((sum, r) => sum + r.score, 0),
            total_rating_earned: results.reduce((sum, r) => sum + r.rating_earned, 0),
            average_score: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
            best_score: Math.max(...results.map(r => r.score)),
        };

        return { data: stats, error: null };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { data: null, error };
    }
};

/**
 * Get user's recent quiz results
 */
export const getUserRecentResults = async (
    userId: number,
    limit: number = 10
): Promise<{ data: QuizResult[] | null; error: any }> => {
    try {
        const { data, error } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user results:', error);
        return { data: null, error };
    }
};

/**
 * Get leaderboard (top users by rating)
 */
export const getLeaderboard = async (limit: number = 50): Promise<{ data: User[] | null; error: any }> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('rating', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return { data: null, error };
    }
};
