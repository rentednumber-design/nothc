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

  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              isCorrect: opt.id === optionId,
            })),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-900 font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isTelegramWebApp()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
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
            isCorrect: opt.isCorrect
          }))
        }))
      } as any);

      if (error) throw error;

      setGameCode(data?.game_code);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24 font-sans">
      <div className="max-w-2xl mx-auto p-4">
        {gameCode ? (
          <div className="glass-card p-8 rounded-2xl text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Created!</h2>
            <p className="text-gray-600 mb-6">Share this code with your friends to play.</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <span className="font-mono font-bold text-4xl tracking-wider text-indigo-600">{gameCode}</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(gameCode);
                alert('Copied to clipboard!');
              }}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Copy Code
            </button>

            <button
              onClick={() => {
                setGameCode(null);
                setQuizTitle('');
                setQuestions([{
                  id: crypto.randomUUID(),
                  text: '',
                  options: [
                    { id: crypto.randomUUID(), text: '', isCorrect: false },
                    { id: crypto.randomUUID(), text: '', isCorrect: false },
                  ],
                }]);
                setCurrentQuestionIndex(0);
              }}
              className="mt-4 text-gray-500 hover:text-gray-700 font-medium"
            >
              Create Another Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Create Quiz
                </h1>
                {telegramUser?.photo_url && (
                  <img
                    src={telegramUser.photo_url}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                  <input
                    type="text"
                    placeholder="e.g., 'General Knowledge 2024'"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-gray-200">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">Public Quiz</span>
                    <span className="text-xs text-gray-500">
                      {isPublic ? 'Anyone can find and take this quiz' : 'Only people with the code can join'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isPublic ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${isPublic ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${currentQuestionIndex === index
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={addNewQuestion}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Question Editor */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Question {currentQuestionIndex + 1}
                </h2>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(currentQuestion.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    title="Remove Question"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                  <textarea
                    placeholder="What is the capital of France?"
                    value={currentQuestion.text}
                    onChange={(e) =>
                      updateQuestionText(currentQuestion.id, e.target.value)
                    }
                    rows={2}
                    className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={option.id} className="group flex items-center space-x-3 bg-white/50 p-2 pr-3 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200 transition-all">
                      <div className="relative">
                        <input
                          type="radio"
                          name={`correct-answer-${currentQuestion.id}`}
                          checked={option.isCorrect}
                          onChange={() => setCorrectOption(currentQuestion.id, option.id)}
                          className="peer sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${option.isCorrect
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setCorrectOption(currentQuestion.id, option.id)}
                        >
                          {option.isCorrect && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          updateOption(currentQuestion.id, option.id, {
                            text: e.target.value,
                          })
                        }
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-400"
                      />

                      {currentQuestion.options.length > 2 && (
                        <button
                          onClick={() =>
                            removeOption(currentQuestion.id, option.id)
                          }
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => addOption(currentQuestion.id)}
                    className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Option
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
              <div className="max-w-2xl mx-auto pointer-events-auto">
                <button
                  onClick={handleSaveQuiz}
                  disabled={!quizTitle.trim() || !currentQuestion.text.trim() || loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Quiz...
                    </>
                  ) : 'Create Quiz'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
