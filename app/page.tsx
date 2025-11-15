export const dynamic = "auto";
export const revalidate = 0;


import Image from "next/image";
import UserInfo from '@/components/UserInfo';
import TelegramProvider from "./telegram-provider";

export default function Home() {
  return (
    <TelegramProvider>
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">
            My Telegram Mini App
          </h1>
          <UserInfo />
        </div>

      </main>
    </div>
    </TelegramProvider>
  );
}
