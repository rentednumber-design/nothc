"use client"
import { useEffect, useState } from "react";
import { Trophy, Gift } from "lucide-react";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code: string;
  is_premium?: boolean;
}

const categories = [
  { id: 1, icon: "⚽", name: "Футбол", emoji: "⚽" },
  { id: 2, icon: "🔬", name: "Наука", emoji: "🔬" },
  { id: 3, icon: "👕", name: "Мода", emoji: "👕" },
  { id: 4, icon: "🎬", name: "Фильм", emoji: "🎬" },
  { id: 5, icon: "🎵", name: "Музыка", emoji: "🎵" },
];

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (typeof window === "undefined") return;
      try {
        const { default: WebApp } = await import("@twa-dev/sdk");
        if (WebApp?.initDataUnsafe?.user && mounted) {
          setUserData(WebApp.initDataUnsafe.user as UserData);
        }
      } catch (e) {
        // Fallback for development
        if (mounted) {
          setUserData({
            id: 1,
            first_name: "Настя",
            last_name: "Евгений",
            photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nastya",
            language_code: "ru",
            is_premium: true,
          });
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-300 via-purple-500 to-purple-100 pb-8">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md">
            {userData?.photo_url ? (
              <img
                src={userData.photo_url}
                alt={userData.first_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-400 flex items-center justify-center text-white text-2xl font-bold">
                {userData?.first_name?.[0] || "?"}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">
              {userData ? `${userData.first_name} ${userData.last_name || ""}`.trim() : "Загрузка..."}
            </h1>
            {userData?.is_premium && (
              <span className="inline-block mt-1 px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                Expert
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Current Challenge Card */}
      <div className="px-6 mb-8">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-purple-400 rounded-2xl flex items-center justify-center text-4xl shadow-md">
              ⚓
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white text-2xl font-bold">Задачи</h2>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Gift className="w-5 h-5 text-purple-500" />
                </button>
              </div>
              <p className="text-white/90 text-sm mb-3">14 вопросов</p>
              <div className="space-y-2">
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: "64.2857%" }} // 9/14 ≈ 64.2857%
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/90 font-medium">Прогресс</span>
                  <span className="text-white/90 font-bold">9/14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories - Викторина */}
      <div className="px-6 mb-8">
        <h3 className="text-white text-xl font-bold mb-4">Викторина</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex-shrink-0 w-24 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="w-20 h-20 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-md border border-white/50 hover:bg-white/50 transition-colors">
                {cat.emoji}
              </div>
              <span className="text-white text-sm font-medium text-center">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* More Games - Больше игр */}
      <div className="px-6">
        <h3 className="text-white text-xl font-bold mb-4">Больше игр</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <button
              key={i}
              className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-white/50 hover:bg-white/50 transition-all active:scale-95"
            >
              <div className="aspect-square bg-purple-200/50 rounded-2xl mb-4 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-purple-400" />
              </div>
              <h4 className="text-white font-bold text-base mb-1">
                Языковая викторина
              </h4>
              <p className="text-white/80 text-xs">15 вопросов</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}