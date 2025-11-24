'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard, getOrCreateUser } from '@/services/userService';
import { User } from '@/types/user';
import { Trophy, Medal, Crown, User as UserIcon, Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load leaderboard
                const { data: leaderboardData } = await getLeaderboard(100);
                if (leaderboardData) {
                    setUsers(leaderboardData);
                }

                // Load current user
                if (typeof window !== 'undefined') {
                    const { default: WebApp } = await import('@twa-dev/sdk');
                    if (WebApp?.initDataUnsafe?.user) {
                        const telegramUser = WebApp.initDataUnsafe.user;
                        const { data: dbUser } = await getOrCreateUser({
                            id: telegramUser.id,
                            first_name: telegramUser.first_name,
                            last_name: telegramUser.last_name,
                            username: telegramUser.username,
                            photo_url: telegramUser.photo_url,
                            language_code: telegramUser.language_code,
                            is_premium: telegramUser.is_premium,
                        });
                        if (dbUser) setCurrentUser(dbUser);
                    } else {
                        // Dev fallback
                        const { data: dbUser } = await getOrCreateUser({
                            id: 1,
                            first_name: "Roxane",
                            last_name: "Harley",
                            language_code: "en",
                            is_premium: true,
                        });
                        if (dbUser) setCurrentUser(dbUser);
                    }
                }
            } catch (error) {
                console.error('Error loading leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
            default: return <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
        }
    };

    const getLevel = (rating: number) => {
        if (rating >= 2000) return { name: "Master", color: "text-purple-600 bg-purple-100" };
        if (rating >= 1000) return { name: "Expert", color: "text-blue-600 bg-blue-100" };
        if (rating >= 500) return { name: "Pro", color: "text-green-600 bg-green-100" };
        if (rating >= 100) return { name: "Apprentice", color: "text-orange-600 bg-orange-100" };
        return { name: "Novice", color: "text-gray-600 bg-gray-100" };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-purple-600 pt-12 pb-8 px-6 rounded-b-[32px] shadow-lg mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-yellow-300" />
                        Leaderboard
                    </h1>
                </div>

                {/* Top 3 Podium */}
                <div className="flex items-end justify-center gap-4 mb-4">
                    {/* 2nd Place */}
                    {users[1] && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-300 overflow-hidden mb-2 relative">
                                {users[1].photo_url ? (
                                    <img src={users[1].photo_url} alt={users[1].first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                                        {users[1].first_name[0]}
                                    </div>
                                )}
                                <div className="absolute bottom-0 inset-x-0 bg-gray-400 text-white text-[10px] font-bold text-center py-0.5">2nd</div>
                            </div>
                            <span className="text-white font-medium text-sm truncate max-w-[80px]">{users[1].first_name}</span>
                            <span className="text-white/80 text-xs font-bold">{users[1].rating}</span>
                        </div>
                    )}

                    {/* 1st Place */}
                    {users[0] && (
                        <div className="flex flex-col items-center -mt-4">
                            <div className="relative">
                                <Crown className="w-8 h-8 text-yellow-300 absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
                                <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 relative shadow-lg shadow-yellow-500/50">
                                    {users[0].photo_url ? (
                                        <img src={users[0].photo_url} alt={users[0].first_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-2xl">
                                            {users[0].first_name[0]}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 bg-yellow-500 text-white text-xs font-bold text-center py-0.5">1st</div>
                                </div>
                            </div>
                            <span className="text-white font-bold text-base truncate max-w-[100px]">{users[0].first_name}</span>
                            <span className="text-yellow-300 text-sm font-black">{users[0].rating}</span>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {users[2] && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-amber-600 overflow-hidden mb-2 relative">
                                {users[2].photo_url ? (
                                    <img src={users[2].photo_url} alt={users[2].first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xl">
                                        {users[2].first_name[0]}
                                    </div>
                                )}
                                <div className="absolute bottom-0 inset-x-0 bg-amber-700 text-white text-[10px] font-bold text-center py-0.5">3rd</div>
                            </div>
                            <span className="text-white font-medium text-sm truncate max-w-[80px]">{users[2].first_name}</span>
                            <span className="text-white/80 text-xs font-bold">{users[2].rating}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* List View */}
            <div className="px-6 space-y-3">
                {users.slice(3).map((user, index) => {
                    const level = getLevel(user.rating);
                    const isCurrentUser = currentUser?.id === user.id;

                    return (
                        <div
                            key={user.id}
                            className={`bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border ${isCurrentUser ? 'border-purple-500 ring-1 ring-purple-500' : 'border-transparent'}`}
                        >
                            <div className="flex-shrink-0 w-8 flex justify-center">
                                {getRankIcon(index + 3)}
                            </div>

                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                {user.photo_url ? (
                                    <img src={user.photo_url} alt={user.first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                        {user.first_name[0]}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-800 truncate">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                    {isCurrentUser && (
                                        <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full">YOU</span>
                                    )}
                                </div>
                                <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium mt-1 ${level.color}`}>
                                    {level.name}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-black text-gray-800">{user.rating}</div>
                                <div className="text-[10px] text-gray-400 font-medium">PTS</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Current User Sticky Footer (if not in top 3 and scrolled) */}
            {currentUser && !users.slice(0, 3).find(u => u.id === currentUser.id) && (
                <div className="fixed bottom-20 left-6 right-6">
                    <div className="bg-purple-900 text-white rounded-2xl p-4 flex items-center gap-4 shadow-xl border border-purple-700">
                        <div className="flex-shrink-0 w-8 flex justify-center font-bold text-purple-300">
                            #{users.findIndex(u => u.id === currentUser.id) + 1}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-purple-800 overflow-hidden flex-shrink-0 border border-purple-600">
                            {currentUser.photo_url ? (
                                <img src={currentUser.photo_url} alt={currentUser.first_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-purple-300 font-bold">
                                    {currentUser.first_name[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">
                                {currentUser.first_name} {currentUser.last_name}
                            </h3>
                            <div className="text-purple-300 text-xs">
                                {getLevel(currentUser.rating).name}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-black text-white">{currentUser.rating}</div>
                            <div className="text-[10px] text-purple-300 font-medium">PTS</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
