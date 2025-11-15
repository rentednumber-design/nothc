'use client';

import { useEffect, useState } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

interface LaunchParams {
  initData?: {
    user?: User;
    // Add other properties from initData if needed
  };
}

interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
}

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // This code only runs on the client side
    try {
      const { initData } = retrieveLaunchParams() as LaunchParams;
      if (initData?.user) {
        setUser(initData.user);
      }
    } catch (error) {
      console.error('Error retrieving Telegram user data:', error);
    }
  }, []);

  // Handle loading state consistently between server and client
  if (typeof window === 'undefined' || !user) {
    return <div className="p-6 bg-transparent rounded-lg shadow text-center">Loading user data...</div>;
  }

  return (
    <div className="p-6 bg-transparent rounded-lg shadow text-center">
      <h2 className="text-xl font-bold mb-4">Your Telegram Profile</h2>
      {user.photo_url && (
        <img
          src={user.photo_url}
          alt="Profile"
          className="mx-auto rounded-full w-24 h-24 mb-4"
        />
      )}
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> @{user.username || 'Not set'}</p>
      <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
    </div>
  );
}
