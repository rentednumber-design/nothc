export type User = {
    id: number; // Telegram user ID
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    rating: number;
    language_code?: string;
    is_premium?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type QuizResult = {
    id?: string;
    user_id: number;
    quiz_id?: string;
    score: number;
    rating_earned: number;
    questions_answered: number;
    correct_answers: number;
    completed_at?: string;
};

export type UserStats = {
    total_quizzes: number;
    total_score: number;
    total_rating_earned: number;
    average_score: number;
    best_score: number;
};

export type CreateUserDTO = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
    is_premium?: boolean;
};
