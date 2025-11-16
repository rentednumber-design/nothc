// src/app/layout.tsx

import './globals.css';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'], weight: ['400'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <main className="flex-1 pb-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
