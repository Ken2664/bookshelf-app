"use client";

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <nav className="flex items-center justify-between p-4 bg-blue-600">
        <Link href="/" className="text-white text-lg font-bold">Bookshelf App</Link>
        <Link href="/login" className="text-white">ログイン</Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600">
      <Link href="/" className="text-white text-lg font-bold">Bookshelf App</Link>
      <div>
        <Link href="/authors/add" className="mr-4 text-white">お気に入り作家</Link>
        <Link href="/books" className="mr-4 text-white">本の管理</Link>
        <Link href="/my-page" className="mr-4 text-white">マイページ</Link>
        <Link href="/loans" className="mr-4 text-white">貸し借り管理</Link>
        <button onClick={handleLogout} className="px-3 py-1 text-white bg-red-500 rounded">
          ログアウト
        </button>
      </div>
    </nav>
  );
}