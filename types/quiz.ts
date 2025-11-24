export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
};

export type Quiz = {
  id?: string;
  title: string;
  is_public: boolean;
  author_id: string;
  author_name: string;
  author_username: string;
  game_code: string;
  status: 'waiting' | 'started' | 'finished';
  questions: Question[];
  created_at?: string;
  updated_at?: string;
};

export type CreateQuizDTO = Omit<Quiz, 'id' | 'created_at' | 'updated_at' | 'game_code'>;
