'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getQuizByCode, updateQuizStatus } from '@/services/quizService';
import { Quiz } from '@/types/quiz';
import { Users, Play, Trophy, Copy, Check } from 'lucide-react';

type Player = {
    username: string;
    joinedAt: string;
};

export default function HostPage() {
    const params = useParams();
    const router = useRouter();
    const gameCode = params.gameCode as string;
    const supabase = createClient();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            const { data } = await getQuizByCode(gameCode);
            if (data) {
                setQuiz(data);
            }
            setLoading(false);
        };

        fetchQuiz();

        // Subscribe to presence channel
        const channel = supabase.channel(`quiz_${gameCode}`);

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const joinedPlayers: Player[] = [];

                Object.values(newState).forEach((presences: any) => {
                    presences.forEach((presence: any) => {
                        if (presence.username) {
                            joinedPlayers.push({
                                username: presence.username,
                                joinedAt: presence.joinedAt,
                            });
                        }
                    });
                });

                // Sort by join time
                joinedPlayers.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());
                setPlayers(joinedPlayers);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Host doesn't need to track their own presence as a player
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameCode]);

    const handleStartGame = async () => {
        setStarting(true);
        await updateQuizStatus(gameCode, 'started');
        // Host can stay here or be redirected to a dashboard/leaderboard
        // For now, let's keep them here or maybe show a "Game in Progress" view
    };

    const copyCode = () => {
        navigator.clipboard.writeText(gameCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center text-white">
                Quiz not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                            <p className="text-purple-200">Waiting for players to join...</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 border border-white/10">
                                <span className="text-purple-200 text-sm font-medium uppercase tracking-wider">Game Code</span>
                                <span className="text-3xl font-mono font-bold text-white tracking-widest">{gameCode}</span>
                                <button
                                    onClick={copyCode}
                                    className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Player List */}
                    <div className="md:col-span-2">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 min-h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Users className="w-6 h-6" />
                                    Players Joined
                                </h2>
                                <span className="bg-purple-500/50 px-3 py-1 rounded-full text-white font-medium">
                                    {players.length}
                                </span>
                            </div>

                            {players.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-white/40">
                                    <div className="animate-pulse mb-4">
                                        <Users className="w-16 h-16 opacity-50" />
                                    </div>
                                    <p>Waiting for players...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {players.map((player, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {player.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium truncate">{player.username}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Trophy className="w-6 h-6" />
                                Game Info
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-white/80 border-b border-white/10 pb-3">
                                    <span>Questions</span>
                                    <span className="font-bold text-white">{quiz.questions.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/80 border-b border-white/10 pb-3">
                                    <span>Status</span>
                                    <span className="font-bold text-white capitalize">{quiz.status || 'Waiting'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartGame}
                            disabled={starting || players.length === 0}
                            className="w-full bg-white text-purple-600 font-bold text-xl py-6 rounded-3xl shadow-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {starting ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6 fill-current" />
                                    Start Game
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
