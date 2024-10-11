"use client";

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 修正ポイント

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/profile'); // プロフィール編集画面へのリダイレクト
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-xl font-bold">Googleで登録</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-3 py-2 text-white bg-blue-500 rounded"
        >
          Googleでサインイン
        </button>
        <p className="mt-4 text-center">
          すでにアカウントをお持ちですか？ <a href="/login" className="text-blue-500">ログイン</a>
        </p>
      </div>
    </div>
  );
}