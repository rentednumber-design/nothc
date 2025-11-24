-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,  -- Telegram user ID
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    photo_url TEXT,
    rating INTEGER DEFAULT 0 NOT NULL,
    language_code TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
    score INTEGER NOT NULL,
    rating_earned INTEGER NOT NULL,
    questions_answered INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_completed_at ON quiz_results(completed_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all user data
CREATE POLICY "Users can read all users" ON users
    FOR SELECT USING (true);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Policy: Users can read all quiz results
CREATE POLICY "Users can read all quiz results" ON quiz_results
    FOR SELECT USING (true);

-- Policy: Users can insert quiz results
CREATE POLICY "Users can insert quiz results" ON quiz_results
    FOR INSERT WITH CHECK (true);
