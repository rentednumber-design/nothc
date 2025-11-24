"use client"
import { useEffect, useState } from "react";
import { Trophy, Gift, Zap, ChevronRight, Music, Clapperboard, Shirt, Microscope } from "lucide-react";
import Link from "next/link";
import { getOrCreateUser } from "@/services/userService";
import { User } from "@/types/user";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code: string;
  is_premium?: boolean;
}

const categories = [
  { id: 1, icon: "⚽", name: "Football", color: "bg-blue-100" },
  { id: 2, icon: <Microscope className="w-6 h-6 text-purple-600" />, name: "Science", color: "bg-purple-100" },
  { id: 3, icon: <Shirt className="w-6 h-6 text-orange-600" />, name: "Fashion", color: "bg-orange-100" },
  { id: 4, icon: <Clapperboard className="w-6 h-6 text-red-600" />, name: "Movie", color: "bg-red-100" },
  { id: 5, icon: <Music className="w-6 h-6 text-pink-600" />, name: "Music", color: "bg-pink-100" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (typeof window === "undefined") return;
      try {
        const { default: WebApp } = await import("@twa-dev/sdk");
        if (WebApp?.initDataUnsafe?.user && mounted) {
          const telegramUser = WebApp.initDataUnsafe.user as TelegramUser;
          // Get or create user in database
          const { data: dbUser } = await getOrCreateUser({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            photo_url: telegramUser.photo_url,
            language_code: telegramUser.language_code,
            is_premium: telegramUser.is_premium,
          });
          if (dbUser && mounted) {
            setUser(dbUser);
          }
        }
      } catch (e) {
        if (mounted) {
          // Fallback for development
          const { data: dbUser } = await getOrCreateUser({
            id: 1,
            first_name: "Roxane",
            last_name: "Harley",
            language_code: "en",
            is_premium: true,
          });
          if (dbUser) {
            setUser(dbUser);
          }
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const getLevel = (rating: number) => {
    if (rating >= 2000) return "Master";
    if (rating >= 1000) return "Expert";
    if (rating >= 500) return "Pro";
    if (rating >= 100) return "Apprentice";
    return "Novice";
  };

  return (
    <div className="min-h-screen pb-24 pt-12 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                {user?.first_name?.[0] || "?"}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              {user ? `${user.first_name} ${user.last_name || ""}`.trim() : "Loading..."}
            </h1>
            <div className="inline-flex items-center px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-[10px] text-white font-medium">
                {user ? getLevel(user.rating) : "Novice"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white rounded-full pl-1 pr-3 py-1 shadow-sm">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white fill-current" />
          </div>
          <span className="text-sm font-bold text-gray-800">
            {user ? user.rating : 0}
          </span>
        </div>
      </div>

      {/* Daily Task Card */}
      <div className="mb-8 relative group">
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-[32px] transform group-hover:scale-105 transition-transform duration-500" />
        <div className="relative bg-white/30 backdrop-blur-md border border-white/40 rounded-[32px] p-6 flex items-center gap-6 shadow-lg overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl" />

          <div className="w-20 h-20 flex-shrink-0 relative">
            {/* Placeholder for the anchor illustration */}
            <div className="w-full h-full bg-gradient-to-br from-purple-200 to-indigo-300 rounded-2xl flex items-center justify-center shadow-inner transform rotate-3">
              <span className="text-4xl filter drop-shadow-md">⚓</span>
            </div>
          </div>

          <div className="flex-1 z-10">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-white text-xl font-bold">Daily Task</h2>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                </div>
              </div>
            </div>
            <p className="text-white/80 text-xs mb-3">Your Rating:{user?.rating}</p>

            <div className="space-y-1.5">
              <div className="h-2 bg-black/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full w-[65%]" />
              </div>
              <div className="flex justify-between text-[10px] text-white/90 font-medium">
                <span>Progress</span>
                <span>{user?.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Categories */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-white text-lg font-bold">Quiz</h3>
          <button className="text-white/80 text-xs hover:text-white transition-colors">View All</button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link href={`/play?code=${cat.name.toUpperCase()}`} key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`w-14 h-14 ${cat.color} backdrop-blur-md bg-opacity-90 rounded-2xl flex items-center justify-center shadow-sm border border-white/50 group-hover:-translate-y-1 transition-transform duration-300`}>
                {typeof cat.icon === 'string' ? <span className="text-2xl">{cat.icon}</span> : cat.icon}
              </div>
              <span className="text-white text-[10px] font-medium text-center opacity-90">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* More Games */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-white text-lg font-bold">More Games</h3>
          <button className="text-white/80 text-xs hover:text-white transition-colors">View All</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/play?code=LANGUAGE" className="bg-white rounded-[28px] p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-50 rounded-2xl mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <span className="text-5xl filter drop-shadow-sm">⚔️</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-0.5">Language Quiz</h4>
            <p className="text-gray-400 text-[10px] mb-3">5 Questions</p>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Zap className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold">24.7K</span>
              </div>
            </div>
          </Link>

          <Link href="/play?code=EXAM" className="bg-white rounded-[28px] p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-50 rounded-2xl mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <span className="text-5xl filter drop-shadow-sm">🧭</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-0.5">Exam Quiz</h4>
            <p className="text-gray-400 text-[10px] mb-3">5 Questions</p>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Zap className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold">12.5K</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}