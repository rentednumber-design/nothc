"use client"
import { useEffect, useState } from "react";
interface UserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code: string;
    is_premium?: boolean;
}
export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (typeof window === "undefined") return;
      const { default: WebApp } = await import("@twa-dev/sdk");
      if (WebApp?.initDataUnsafe?.user && mounted) {
        setUserData(WebApp.initDataUnsafe.user as UserData);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
    <main className="p-4">
      {
        userData ? (
          <div>
            <img src={userData.photo_url} alt="" />
            <h1>{userData.first_name}</h1>
            <p>{userData.last_name}</p>
            <p>{userData.username}</p>
            <p>{userData.language_code}</p>
            <p>{userData.is_premium}</p>
          </div>
        ) : (
          <div>
            <p>No user data</p>
          </div>
        )
      }
    </main>
    </>
  );
}
