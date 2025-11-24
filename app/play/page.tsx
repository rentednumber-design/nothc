"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Timer, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getQuizByCode } from "@/services/quizService";
import { Quiz } from "@/types/quiz";

type GameState = "input" | "playing" | "finished";

export default function PlayPage() {
    const router = useRouter();
    const [gameCode, setGameCode] = useState("");
    const [gameState, setGameState] = useState<GameState>("input");
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);

    const handleJoinGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameCode.trim()) return;

        setLoading(true);
        setError("");

        try {
            const { data, error } = await getQuizByCode(gameCode);

            if (error || !data) {
                setError("Quiz not found. Please check the code and try again.");
            } else {
                setQuiz(data);
                setGameState("playing");
                setCurrentQuestionIndex(0);
                setScore(0);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionId: string) => {
        if (isAnswerChecked) return;
        setSelectedOption(optionId);
    };

    const handleCheckAnswer = () => {
        if (!selectedOption || !quiz) return;

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const selectedOpt = currentQuestion.options.find(opt => opt.id === selectedOption);

        if (selectedOpt?.isCorrect) {
            setScore(prev => prev + 1);
        }

        setIsAnswerChecked(true);

        // Wait a bit before moving to next question
        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsAnswerChecked(false);
            } else {
                setGameState("finished");
            }
        }, 1500);
    };

    const resetGame = () => {
        setGameState("input");
        setGameCode("");
        setQuiz(null);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setError("");
    };

    if (gameState === "input") {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-300 via-purple-500 to-purple-100 flex flex-col">
                <div className="p-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Join Quiz</h1>
                            <p className="text-white/80">Enter the game code to start playing</p>
                        </div>

                        <form onSubmit={handleJoinGame} className="space-y-4">
                            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-2 border border-white/30 shadow-lg">
                                <input
                                    type="text"
                                    value={gameCode}
                                    onChange={(e) => setGameCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="w-full bg-transparent border-none text-center text-3xl font-bold text-white placeholder-white/40 focus:ring-0 py-4 tracking-widest"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-100 bg-red-500/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || gameCode.length < 4}
                                className="w-full bg-white text-purple-600 font-bold text-lg py-4 rounded-3xl shadow-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {loading ? "Joining..." : "Enter Game"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === "playing" && quiz) {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

        return (
            <div className="min-h-screen bg-linear-to-br from-purple-300 via-purple-500 to-purple-100 flex flex-col">
                {/* Header */}
                <div className="px-6 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setGameState("input")}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <span className="text-white font-medium text-sm">
                                {currentQuestionIndex + 1} / {quiz.questions.length}
                            </span>
                        </div>
                        <div className="w-10" /> {/* Spacer */}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-black/10 rounded-full overflow-hidden mb-8">
                        <div
                            className="h-full bg-white transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Question */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white text-center leading-tight">
                            {currentQuestion.text}
                        </h2>
                    </div>
                </div>

                {/* Options */}
                <div className="flex-1 px-6 pb-8 flex flex-col justify-end gap-4">
                    {currentQuestion.options.map((option) => {
                        let optionStyle = "bg-white/20 border-white/30 text-white hover:bg-white/30";

                        if (isAnswerChecked) {
                            if (option.isCorrect) {
                                optionStyle = "bg-green-500 text-white border-green-400";
                            } else if (selectedOption === option.id) {
                                optionStyle = "bg-red-500 text-white border-red-400";
                            } else {
                                optionStyle = "bg-white/10 border-white/10 text-white/50";
                            }
                        } else if (selectedOption === option.id) {
                            optionStyle = "bg-white text-purple-600 border-white";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={isAnswerChecked}
                                className={`w-full p-4 rounded-2xl border-2 backdrop-blur-sm transition-all duration-200 font-medium text-lg text-left flex items-center justify-between group ${optionStyle}`}
                            >
                                <span>{option.text}</span>
                                {isAnswerChecked && option.isCorrect && (
                                    <CheckCircle className="w-6 h-6" />
                                )}
                                {isAnswerChecked && selectedOption === option.id && !option.isCorrect && (
                                    <XCircle className="w-6 h-6" />
                                )}
                            </button>
                        );
                    })}

                    {!isAnswerChecked && (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={!selectedOption}
                            className="w-full bg-white text-purple-600 font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-4"
                        >
                            Check Answer
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (gameState === "finished" && quiz) {
        const percentage = Math.round((score / quiz.questions.length) * 100);

        return (
            <div className="min-h-screen bg-linear-to-br from-purple-300 via-purple-500 to-purple-100 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Trophy className="w-12 h-12 text-purple-500" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-white/80 mb-8">{quiz.title}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/10 rounded-2xl p-4">
                            <div className="text-3xl font-bold text-white mb-1">{score}</div>
                            <div className="text-white/60 text-sm">Correct</div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4">
                            <div className="text-3xl font-bold text-white mb-1">{quiz.questions.length}</div>
                            <div className="text-white/60 text-sm">Total</div>
                        </div>
                    </div>

                    <div className="text-5xl font-bold text-white mb-8">
                        {percentage}%
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={resetGame}
                            className="w-full bg-white text-purple-600 font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-purple-50 transition-all active:scale-95"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-transparent border-2 border-white/30 text-white font-bold text-lg py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
