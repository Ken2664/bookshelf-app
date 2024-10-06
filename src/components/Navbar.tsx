"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

// ナビゲーションリンクのリスト
const navLinks = [
  { href: '/authors/add', label: 'お気に入り作家' },
  { href: '/books', label: '本の管理' },
  { href: '/my-page', label: 'マイページ' },
  { href: '/loans', label: '貸し借り管理' },
];

// カスタムフックを作成して、ルーティングの変更を監視
function useRouteChange(callback: () => void) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    callback();
  }, [pathname, callback]);
}

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }, [router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // ルート変更時にメニューを閉じる
  useRouteChange(useCallback(() => {
    setIsMenuOpen(false);
  }, []));

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
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} flex-col md:flex-row absolute md:relative top-16 md:top-0 right-0 md:right-auto bg-blue-600 md:bg-transparent w-full md:w-auto`}>
        <div className="flex flex-col md:flex-row items-end md:items-center pr-4 md:pr-0">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block md:inline-block mr-0 md:mr-4 mt-2 md:mt-0 text-white">
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="block md:inline-block px-3 py-1 mt-2 md:mt-0 text-white bg-red-500 rounded">
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
}