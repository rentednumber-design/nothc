'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
}

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const webApp = (window as any).Telegram?.WebApp;
    if (!webApp) {
      setError(true);
      setLoading(false);
      return;
    }

    webApp.ready();
    webApp.expand();

    const initData = webApp.initData;
    if (!initData) {
      setError(true);
      setLoading(false);
      return;
    }

    // Validate server-side
    fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.user) {
          setUser(data.user);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load user data.</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Your Telegram Profile</h2>
      <p><strong>ID:</strong> {user?.id}</p>
      <p><strong>Username:</strong> @{user?.username || 'Not set'}</p>
      <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
    </div>
  );
}
