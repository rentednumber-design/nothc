import { Quiz } from '@/types/quiz';

export const defaultQuizzes: Quiz[] = [
    // Football Quiz
    {
        id: 'football-quiz',
        title: 'Football Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'FOOTBALL',
        questions: [
            {
                id: 'fb-q1',
                text: 'Which country won the FIFA World Cup in 2018?',
                options: [
                    { id: 'fb-q1-a', text: 'Brazil', isCorrect: false },
                    { id: 'fb-q1-b', text: 'France', isCorrect: true },
                    { id: 'fb-q1-c', text: 'Germany', isCorrect: false },
                    { id: 'fb-q1-d', text: 'Argentina', isCorrect: false },
                ],
            },
            {
                id: 'fb-q2',
                text: 'Who is known as "The King of Football"?',
                options: [
                    { id: 'fb-q2-a', text: 'Diego Maradona', isCorrect: false },
                    { id: 'fb-q2-b', text: 'Cristiano Ronaldo', isCorrect: false },
                    { id: 'fb-q2-c', text: 'Pelé', isCorrect: true },
                    { id: 'fb-q2-d', text: 'Lionel Messi', isCorrect: false },
                ],
            },
            {
                id: 'fb-q3',
                text: 'How many players are on a football team on the field?',
                options: [
                    { id: 'fb-q3-a', text: '9', isCorrect: false },
                    { id: 'fb-q3-b', text: '10', isCorrect: false },
                    { id: 'fb-q3-c', text: '11', isCorrect: true },
                    { id: 'fb-q3-d', text: '12', isCorrect: false },
                ],
            },
            {
                id: 'fb-q4',
                text: 'Which club has won the most UEFA Champions League titles?',
                options: [
                    { id: 'fb-q4-a', text: 'Barcelona', isCorrect: false },
                    { id: 'fb-q4-b', text: 'Real Madrid', isCorrect: true },
                    { id: 'fb-q4-c', text: 'AC Milan', isCorrect: false },
                    { id: 'fb-q4-d', text: 'Liverpool', isCorrect: false },
                ],
            },
            {
                id: 'fb-q5',
                text: 'What is the duration of a standard football match?',
                options: [
                    { id: 'fb-q5-a', text: '80 minutes', isCorrect: false },
                    { id: 'fb-q5-b', text: '90 minutes', isCorrect: true },
                    { id: 'fb-q5-c', text: '100 minutes', isCorrect: false },
                    { id: 'fb-q5-d', text: '120 minutes', isCorrect: false },
                ],
            },
        ],
    },

    // Science Quiz
    {
        id: 'science-quiz',
        title: 'Science Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'SCIENCE',
        questions: [
            {
                id: 'sc-q1',
                text: 'What is the chemical symbol for gold?',
                options: [
                    { id: 'sc-q1-a', text: 'Go', isCorrect: false },
                    { id: 'sc-q1-b', text: 'Au', isCorrect: true },
                    { id: 'sc-q1-c', text: 'Gd', isCorrect: false },
                    { id: 'sc-q1-d', text: 'Ag', isCorrect: false },
                ],
            },
            {
                id: 'sc-q2',
                text: 'What planet is known as the Red Planet?',
                options: [
                    { id: 'sc-q2-a', text: 'Venus', isCorrect: false },
                    { id: 'sc-q2-b', text: 'Jupiter', isCorrect: false },
                    { id: 'sc-q2-c', text: 'Mars', isCorrect: true },
                    { id: 'sc-q2-d', text: 'Saturn', isCorrect: false },
                ],
            },
            {
                id: 'sc-q3',
                text: 'What is the speed of light in vacuum?',
                options: [
                    { id: 'sc-q3-a', text: '299,792 km/s', isCorrect: true },
                    { id: 'sc-q3-b', text: '150,000 km/s', isCorrect: false },
                    { id: 'sc-q3-c', text: '500,000 km/s', isCorrect: false },
                    { id: 'sc-q3-d', text: '100,000 km/s', isCorrect: false },
                ],
            },
            {
                id: 'sc-q4',
                text: 'What is the powerhouse of the cell?',
                options: [
                    { id: 'sc-q4-a', text: 'Nucleus', isCorrect: false },
                    { id: 'sc-q4-b', text: 'Ribosome', isCorrect: false },
                    { id: 'sc-q4-c', text: 'Mitochondria', isCorrect: true },
                    { id: 'sc-q4-d', text: 'Chloroplast', isCorrect: false },
                ],
            },
            {
                id: 'sc-q5',
                text: 'What is the most abundant gas in Earth\'s atmosphere?',
                options: [
                    { id: 'sc-q5-a', text: 'Oxygen', isCorrect: false },
                    { id: 'sc-q5-b', text: 'Nitrogen', isCorrect: true },
                    { id: 'sc-q5-c', text: 'Carbon Dioxide', isCorrect: false },
                    { id: 'sc-q5-d', text: 'Hydrogen', isCorrect: false },
                ],
            },
        ],
    },

    // Fashion Quiz
    {
        id: 'fashion-quiz',
        title: 'Fashion Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'FASHION',
        questions: [
            {
                id: 'fs-q1',
                text: 'Which fashion house is known for its iconic interlocking "CC" logo?',
                options: [
                    { id: 'fs-q1-a', text: 'Gucci', isCorrect: false },
                    { id: 'fs-q1-b', text: 'Chanel', isCorrect: true },
                    { id: 'fs-q1-c', text: 'Dior', isCorrect: false },
                    { id: 'fs-q1-d', text: 'Versace', isCorrect: false },
                ],
            },
            {
                id: 'fs-q2',
                text: 'What is the name of the annual fashion event held in New York?',
                options: [
                    { id: 'fs-q2-a', text: 'Fashion Gala', isCorrect: false },
                    { id: 'fs-q2-b', text: 'Style Summit', isCorrect: false },
                    { id: 'fs-q2-c', text: 'Fashion Week', isCorrect: true },
                    { id: 'fs-q2-d', text: 'Couture Convention', isCorrect: false },
                ],
            },
            {
                id: 'fs-q3',
                text: 'Which designer is famous for the "Little Black Dress"?',
                options: [
                    { id: 'fs-q3-a', text: 'Coco Chanel', isCorrect: true },
                    { id: 'fs-q3-b', text: 'Yves Saint Laurent', isCorrect: false },
                    { id: 'fs-q3-c', text: 'Giorgio Armani', isCorrect: false },
                    { id: 'fs-q3-d', text: 'Karl Lagerfeld', isCorrect: false },
                ],
            },
            {
                id: 'fs-q4',
                text: 'What does "haute couture" mean in English?',
                options: [
                    { id: 'fs-q4-a', text: 'Street fashion', isCorrect: false },
                    { id: 'fs-q4-b', text: 'High sewing/dressmaking', isCorrect: true },
                    { id: 'fs-q4-c', text: 'Casual wear', isCorrect: false },
                    { id: 'fs-q4-d', text: 'Vintage clothing', isCorrect: false },
                ],
            },
            {
                id: 'fs-q5',
                text: 'Which Italian city is considered the fashion capital of the world?',
                options: [
                    { id: 'fs-q5-a', text: 'Rome', isCorrect: false },
                    { id: 'fs-q5-b', text: 'Venice', isCorrect: false },
                    { id: 'fs-q5-c', text: 'Milan', isCorrect: true },
                    { id: 'fs-q5-d', text: 'Florence', isCorrect: false },
                ],
            },
        ],
    },

    // Movie Quiz
    {
        id: 'movie-quiz',
        title: 'Movie Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'MOVIE',
        questions: [
            {
                id: 'mv-q1',
                text: 'Which movie won the Academy Award for Best Picture in 1994?',
                options: [
                    { id: 'mv-q1-a', text: 'Pulp Fiction', isCorrect: false },
                    { id: 'mv-q1-b', text: 'Forrest Gump', isCorrect: true },
                    { id: 'mv-q1-c', text: 'The Shawshank Redemption', isCorrect: false },
                    { id: 'mv-q1-d', text: 'The Lion King', isCorrect: false },
                ],
            },
            {
                id: 'mv-q2',
                text: 'Who directed the movie "Inception"?',
                options: [
                    { id: 'mv-q2-a', text: 'Steven Spielberg', isCorrect: false },
                    { id: 'mv-q2-b', text: 'Christopher Nolan', isCorrect: true },
                    { id: 'mv-q2-c', text: 'Quentin Tarantino', isCorrect: false },
                    { id: 'mv-q2-d', text: 'Martin Scorsese', isCorrect: false },
                ],
            },
            {
                id: 'mv-q3',
                text: 'What is the highest-grossing film of all time (unadjusted for inflation)?',
                options: [
                    { id: 'mv-q3-a', text: 'Avengers: Endgame', isCorrect: false },
                    { id: 'mv-q3-b', text: 'Avatar', isCorrect: true },
                    { id: 'mv-q3-c', text: 'Titanic', isCorrect: false },
                    { id: 'mv-q3-d', text: 'Star Wars: The Force Awakens', isCorrect: false },
                ],
            },
            {
                id: 'mv-q4',
                text: 'Which actor played Iron Man in the Marvel Cinematic Universe?',
                options: [
                    { id: 'mv-q4-a', text: 'Chris Evans', isCorrect: false },
                    { id: 'mv-q4-b', text: 'Chris Hemsworth', isCorrect: false },
                    { id: 'mv-q4-c', text: 'Robert Downey Jr.', isCorrect: true },
                    { id: 'mv-q4-d', text: 'Mark Ruffalo', isCorrect: false },
                ],
            },
            {
                id: 'mv-q5',
                text: 'In which year was the first "Harry Potter" movie released?',
                options: [
                    { id: 'mv-q5-a', text: '1999', isCorrect: false },
                    { id: 'mv-q5-b', text: '2000', isCorrect: false },
                    { id: 'mv-q5-c', text: '2001', isCorrect: true },
                    { id: 'mv-q5-d', text: '2002', isCorrect: false },
                ],
            },
        ],
    },

    // Music Quiz
    {
        id: 'music-quiz',
        title: 'Music Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'MUSIC',
        questions: [
            {
                id: 'ms-q1',
                text: 'Who is known as the "King of Pop"?',
                options: [
                    { id: 'ms-q1-a', text: 'Elvis Presley', isCorrect: false },
                    { id: 'ms-q1-b', text: 'Michael Jackson', isCorrect: true },
                    { id: 'ms-q1-c', text: 'Prince', isCorrect: false },
                    { id: 'ms-q1-d', text: 'Freddie Mercury', isCorrect: false },
                ],
            },
            {
                id: 'ms-q2',
                text: 'Which band released the album "Abbey Road"?',
                options: [
                    { id: 'ms-q2-a', text: 'The Rolling Stones', isCorrect: false },
                    { id: 'ms-q2-b', text: 'The Beatles', isCorrect: true },
                    { id: 'ms-q2-c', text: 'Led Zeppelin', isCorrect: false },
                    { id: 'ms-q2-d', text: 'Pink Floyd', isCorrect: false },
                ],
            },
            {
                id: 'ms-q3',
                text: 'What instrument has 88 keys?',
                options: [
                    { id: 'ms-q3-a', text: 'Guitar', isCorrect: false },
                    { id: 'ms-q3-b', text: 'Violin', isCorrect: false },
                    { id: 'ms-q3-c', text: 'Piano', isCorrect: true },
                    { id: 'ms-q3-d', text: 'Harp', isCorrect: false },
                ],
            },
            {
                id: 'ms-q4',
                text: 'Which music genre originated in Jamaica?',
                options: [
                    { id: 'ms-q4-a', text: 'Jazz', isCorrect: false },
                    { id: 'ms-q4-b', text: 'Blues', isCorrect: false },
                    { id: 'ms-q4-c', text: 'Reggae', isCorrect: true },
                    { id: 'ms-q4-d', text: 'Country', isCorrect: false },
                ],
            },
            {
                id: 'ms-q5',
                text: 'Who composed the "Four Seasons"?',
                options: [
                    { id: 'ms-q5-a', text: 'Mozart', isCorrect: false },
                    { id: 'ms-q5-b', text: 'Beethoven', isCorrect: false },
                    { id: 'ms-q5-c', text: 'Vivaldi', isCorrect: true },
                    { id: 'ms-q5-d', text: 'Bach', isCorrect: false },
                ],
            },
        ],
    },

    // Language Quiz
    {
        id: 'language-quiz',
        title: 'Language Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'LANGUAGE',
        questions: [
            {
                id: 'lg-q1',
                text: 'What is the most spoken language in the world by number of native speakers?',
                options: [
                    { id: 'lg-q1-a', text: 'English', isCorrect: false },
                    { id: 'lg-q1-b', text: 'Mandarin Chinese', isCorrect: true },
                    { id: 'lg-q1-c', text: 'Spanish', isCorrect: false },
                    { id: 'lg-q1-d', text: 'Hindi', isCorrect: false },
                ],
            },
            {
                id: 'lg-q2',
                text: 'Which language has the most words?',
                options: [
                    { id: 'lg-q2-a', text: 'English', isCorrect: true },
                    { id: 'lg-q2-b', text: 'French', isCorrect: false },
                    { id: 'lg-q2-c', text: 'German', isCorrect: false },
                    { id: 'lg-q2-d', text: 'Arabic', isCorrect: false },
                ],
            },
            {
                id: 'lg-q3',
                text: 'What does "bonjour" mean in English?',
                options: [
                    { id: 'lg-q3-a', text: 'Goodbye', isCorrect: false },
                    { id: 'lg-q3-b', text: 'Hello/Good day', isCorrect: true },
                    { id: 'lg-q3-c', text: 'Thank you', isCorrect: false },
                    { id: 'lg-q3-d', text: 'Please', isCorrect: false },
                ],
            },
            {
                id: 'lg-q4',
                text: 'Which language is known as the "language of love"?',
                options: [
                    { id: 'lg-q4-a', text: 'Italian', isCorrect: false },
                    { id: 'lg-q4-b', text: 'Spanish', isCorrect: false },
                    { id: 'lg-q4-c', text: 'French', isCorrect: true },
                    { id: 'lg-q4-d', text: 'Portuguese', isCorrect: false },
                ],
            },
            {
                id: 'lg-q5',
                text: 'What is a group of words that contains a subject and a verb called?',
                options: [
                    { id: 'lg-q5-a', text: 'Phrase', isCorrect: false },
                    { id: 'lg-q5-b', text: 'Clause', isCorrect: true },
                    { id: 'lg-q5-c', text: 'Sentence', isCorrect: false },
                    { id: 'lg-q5-d', text: 'Paragraph', isCorrect: false },
                ],
            },
        ],
    },

    // Exam Quiz
    {
        id: 'exam-quiz',
        title: 'Exam Quiz',
        is_public: true,
        author_id: 'system',
        author_name: 'Quiz Master',
        author_username: 'quizmaster',
        game_code: 'EXAM',
        questions: [
            {
                id: 'ex-q1',
                text: 'What is the capital of France?',
                options: [
                    { id: 'ex-q1-a', text: 'London', isCorrect: false },
                    { id: 'ex-q1-b', text: 'Paris', isCorrect: true },
                    { id: 'ex-q1-c', text: 'Berlin', isCorrect: false },
                    { id: 'ex-q1-d', text: 'Madrid', isCorrect: false },
                ],
            },
            {
                id: 'ex-q2',
                text: 'What is 15% of 200?',
                options: [
                    { id: 'ex-q2-a', text: '20', isCorrect: false },
                    { id: 'ex-q2-b', text: '25', isCorrect: false },
                    { id: 'ex-q2-c', text: '30', isCorrect: true },
                    { id: 'ex-q2-d', text: '35', isCorrect: false },
                ],
            },
            {
                id: 'ex-q3',
                text: 'Who wrote "Romeo and Juliet"?',
                options: [
                    { id: 'ex-q3-a', text: 'Charles Dickens', isCorrect: false },
                    { id: 'ex-q3-b', text: 'William Shakespeare', isCorrect: true },
                    { id: 'ex-q3-c', text: 'Jane Austen', isCorrect: false },
                    { id: 'ex-q3-d', text: 'Mark Twain', isCorrect: false },
                ],
            },
            {
                id: 'ex-q4',
                text: 'What is the largest ocean on Earth?',
                options: [
                    { id: 'ex-q4-a', text: 'Atlantic Ocean', isCorrect: false },
                    { id: 'ex-q4-b', text: 'Indian Ocean', isCorrect: false },
                    { id: 'ex-q4-c', text: 'Pacific Ocean', isCorrect: true },
                    { id: 'ex-q4-d', text: 'Arctic Ocean', isCorrect: false },
                ],
            },
            {
                id: 'ex-q5',
                text: 'In what year did World War II end?',
                options: [
                    { id: 'ex-q5-a', text: '1943', isCorrect: false },
                    { id: 'ex-q5-b', text: '1944', isCorrect: false },
                    { id: 'ex-q5-c', text: '1945', isCorrect: true },
                    { id: 'ex-q5-d', text: '1946', isCorrect: false },
                ],
            },
        ],
    },
];
