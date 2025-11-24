import { createClient } from '@/lib/supabase/client';
import { defaultQuizzes } from '@/data/quizData';

export async function seedDefaultQuizzes() {
    const supabase = createClient();

    try {
        console.log('Starting quiz seeding...');

        for (const quiz of defaultQuizzes) {
            // Check if quiz already exists
            const { data: existingQuiz } = await supabase
                .from('quizzes')
                .select('id')
                .eq('game_code', quiz.game_code)
                .single();

            if (existingQuiz) {
                console.log(`Quiz "${quiz.title}" already exists, skipping...`);
                continue;
            }

            // Insert new quiz
            const quizToInsert = {
                title: quiz.title,
                is_public: quiz.is_public,
                author_id: quiz.author_id,
                author_name: quiz.author_name,
                author_username: quiz.author_username,
                game_code: quiz.game_code,
                questions: JSON.stringify(quiz.questions),
            };

            const { data, error } = await supabase
                .from('quizzes')
                .insert(quizToInsert)
                .select()
                .single();

            if (error) {
                console.error(`Error inserting quiz "${quiz.title}":`, error);
            } else {
                console.log(`✓ Successfully seeded quiz: "${quiz.title}" with code ${quiz.game_code}`);
            }
        }

        console.log('Quiz seeding completed!');
        return { success: true };
    } catch (error) {
        console.error('Error during quiz seeding:', error);
        return { success: false, error };
    }
}
