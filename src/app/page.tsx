"use client";

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Bookshelf Appへようこそ</h1>
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          ログイン
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">マイ本棚</h1>
      {/* ここに本の一覧を表示するコンポーネントを追加 */}
    </div>
  );
}