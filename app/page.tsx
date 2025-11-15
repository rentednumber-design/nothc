// src/app/page.tsx
import UserInfo from '@/components/UserInfo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          My Telegram Mini App
        </h1>
        <UserInfo />
      </div>
    </main>
  );
}
