'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Bookmark, Clock, Users, Zap, SkipForward, Check, X, Gamepad2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getQuizByCode } from '@/services/quizService';
import { Quiz } from '@/types/quiz';
import { useSearchParams } from 'next/navigation';

function PlayPageContent() {
    // State
    const [gameCode, setGameCode] = useState('');
    const [status, setStatus] = useState<'LOBBY' | 'PLAYING' | 'FINISHED'>('LOBBY');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(20);
    const [score, setScore] = useState(0);

    const searchParams = useSearchParams();

    // Check for code parameter in URL and auto-load quiz
    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl && status === 'LOBBY') {
            setGameCode(codeFromUrl);
            loadQuizByCode(codeFromUrl);
        }
    }, [searchParams]);

    const loadQuizByCode = async (code: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await getQuizByCode(code);

            if (error || !data) {
                setError('Invalid game code. Please try again.');
            } else {
                setQuiz(data);
                setStatus('PLAYING');
                setCurrentQuestionIndex(0);
                setScore(0);
                setTimeLeft(20);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Timer Effect
    useEffect(() => {
        if (status === 'PLAYING' && timeLeft > 0 && !selectedOption) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !selectedOption) {
            // Time's up logic - maybe auto-select wrong or just show answer
            // For now, let's just let it sit at 0
        }
    }, [timeLeft, status, selectedOption]);

    const handleJoinGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameCode.trim()) return;
        await loadQuizByCode(gameCode);
    };

    const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
        if (selectedOption) return; // Prevent changing answer

        setSelectedOption(optionId);
        if (isCorrect) {
            // Base points: 100
            // Time bonus: up to 100 points (5 points per second remaining)
            const timeBonus = timeLeft * 5;
            setScore(prev => prev + 100 + timeBonus);
        }

        // Auto advance after delay
        setTimeout(() => {
            if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setTimeLeft(20);
            } else {
                setStatus('FINISHED');
            }
        }, 1500);
    };

    // Render Lobby
    if (status === 'LOBBY') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#a78bfa] to-[#f3e8ff] flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl text-center">
                        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md transform -rotate-6">
                            <Gamepad2 className="w-10 h-10 text-purple-600" />
                        </div>

                        <h1 className="text-white text-3xl font-bold mb-2">Join Quiz</h1>
                        <p className="text-white/80 mb-8">Enter the game code to start playing</p>

                        <form onSubmit={handleJoinGame} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={gameCode}
                                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                                    placeholder="GAME CODE"
                                    className="w-full bg-white/50 border-2 border-white/50 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-widest text-purple-900 placeholder-purple-900/30 focus:outline-none focus:bg-white focus:border-purple-400 transition-all"
                                    maxLength={6}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-100/80 rounded-xl text-red-600 text-sm font-medium animate-fade-in">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !gameCode}
                                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enter Game'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Render Finished
    if (status === 'FINISHED') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#a78bfa] to-[#f3e8ff] flex flex-col items-center justify-center p-6">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl text-center w-full max-w-md">
                    <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-4xl">🏆</span>
                    </div>
                    <h1 className="text-white text-3xl font-bold mb-2">Quiz Completed!</h1>
                    <p className="text-white/90 text-lg mb-6">You scored</p>
                    <div className="text-6xl font-black text-white mb-8 drop-shadow-md">
                        {score}
                    </div>
                    <button
                        onClick={() => {
                            setStatus('LOBBY');
                            setGameCode('');
                            setScore(0);
                        }}
                        className="w-full bg-white text-purple-600 font-bold text-lg py-4 rounded-2xl shadow-md hover:bg-gray-50 transition-colors"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    // Render Playing
    const currentQuestion = quiz?.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#a78bfa] to-[#f3e8ff] pb-24 px-6 pt-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 text-white">
                <button onClick={() => setStatus('LOBBY')} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold">Question {currentQuestionIndex + 1}/{quiz?.questions.length}</h1>
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>

            {/* Question Card */}
            <div className="relative mb-6">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 min-h-[280px] flex flex-col items-center justify-center text-center shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-[32px] pointer-events-none" />
                    <h2 className="text-white text-2xl font-bold leading-relaxed relative z-10">
                        {currentQuestion?.text}
                    </h2>
                </div>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-full p-1.5 flex items-center gap-3 mb-8 shadow-sm">
                <span className="text-xs font-bold text-gray-500 pl-2">Time</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}
                        style={{ width: `${(timeLeft / 20) * 100}%` }}
                    />
                </div>
                <span className={`text-xs font-bold pr-2 ${timeLeft < 5 ? 'text-red-500' : 'text-orange-500'}`}>
                    00:{timeLeft.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
                {currentQuestion?.options.map((option, idx) => {
                    const isSelected = selectedOption === option.id;
                    const isCorrectAnswer = option.isCorrect;

                    // Only show feedback on the selected option
                    const showCorrect = isSelected && isCorrectAnswer;
                    const showWrong = isSelected && !isCorrectAnswer;

                    let cardStyle = 'bg-white border-transparent';
                    if (showCorrect) cardStyle = 'bg-[#ccfbf1] border-[#2dd4bf]';
                    if (showWrong) cardStyle = 'bg-red-50 border-red-400';

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleOptionSelect(option.id, option.isCorrect)}
                            disabled={!!selectedOption}
                            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 group border-2 shadow-sm ${cardStyle} ${!selectedOption && 'hover:border-gray-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${showCorrect ? 'bg-[#2dd4bf] text-white' :
                                    showWrong ? 'bg-red-400 text-white' :
                                        'bg-gray-100 text-gray-500'
                                    }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className={`font-semibold ${showCorrect || showWrong ? 'text-gray-800' : 'text-gray-600'}`}>
                                    {option.text}
                                </span>
                            </div>

                            {showCorrect && (
                                <div className="w-6 h-6 bg-[#2dd4bf] rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                            {showWrong && (
                                <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                                    <X className="w-4 h-4 text-white" />
                                </div>
                            )}
                            {!selectedOption && (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-gray-300" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Lifelines */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { icon: Zap, label: '50/50', color: 'bg-orange-500' },
                    { icon: Users, label: 'Audience', color: 'bg-orange-400' },
                    { icon: Clock, label: 'Add time', color: 'bg-orange-400' },
                    { icon: SkipForward, label: 'Skip', color: 'bg-orange-400' },
                ].map((item, i) => (
                    <button key={i} className={`${item.color} rounded-2xl p-3 flex flex-col items-center justify-center gap-1 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function PlayPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#a78bfa] to-[#f3e8ff] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        }>
            <PlayPageContent />
        </Suspense>
    );
}

