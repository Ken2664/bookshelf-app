"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/my-page');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-xl font-bold">Googleでログイン</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-3 py-2 text-white bg-blue-500 rounded"
        >
          Googleでサインイン
        </button>
        <p className="mt-4 text-center">
          アカウントをお持ちでないですか？ <a href="/register" className="text-blue-500">登録</a>
        </p>
      </div>
    </div>
  );
}
