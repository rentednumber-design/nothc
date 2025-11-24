'use client';

import { useState } from 'react';
import { seedDefaultQuizzes } from '@/scripts/seedQuizzes';
import { CheckCircle, AlertCircle, Loader2, Database } from 'lucide-react';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeed = async () => {
        setStatus('loading');
        setMessage('Seeding quizzes...');

        try {
            const result = await seedDefaultQuizzes();

            if (result.success) {
                setStatus('success');
                setMessage('Successfully seeded all quizzes! You can now use the app.');
            } else {
                setStatus('error');
                setMessage('Failed to seed quizzes. Check console for details.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred while seeding quizzes.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#a78bfa] to-[#f3e8ff] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                        <Database className="w-10 h-10 text-purple-600" />
                    </div>

                    <h1 className="text-white text-3xl font-bold mb-2">Seed Quizzes</h1>
                    <p className="text-white/80 mb-8">
                        Click the button below to populate the database with default quizzes
                    </p>

                    {status === 'idle' && (
                        <button
                            onClick={handleSeed}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all"
                        >
                            Seed Default Quizzes
                        </button>
                    )}

                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                            <p className="text-white font-medium">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4">
                            <CheckCircle className="w-16 h-16 text-green-400" />
                            <p className="text-white font-medium">{message}</p>
                            <a
                                href="/"
                                className="mt-4 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Go to Homepage
                            </a>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle className="w-16 h-16 text-red-400" />
                            <p className="text-white font-medium">{message}</p>
                            <button
                                onClick={handleSeed}
                                className="mt-4 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-white/20 rounded-xl">
                        <p className="text-white/90 text-sm font-medium mb-2">
                            This will create 7 quizzes:
                        </p>
                        <ul className="text-white/80 text-xs space-y-1">
                            <li>⚽ Football Quiz (5 questions)</li>
                            <li>🔬 Science Quiz (5 questions)</li>
                            <li>👔 Fashion Quiz (5 questions)</li>
                            <li>🎬 Movie Quiz (5 questions)</li>
                            <li>🎵 Music Quiz (5 questions)</li>
                            <li>⚔️ Language Quiz (5 questions)</li>
                            <li>🧭 Exam Quiz (5 questions)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
