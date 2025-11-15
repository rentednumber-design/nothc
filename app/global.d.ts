// src/global.d.ts
interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        ready: () => void;
        expand: () => void;
        // add more Telegram WebApp methods if needed
      };
    };
  }
