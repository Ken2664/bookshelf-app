"use client";

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8 text-center text-brown-800">Bookshelf App へようこそ</h1>
        
        <div className="flex justify-center">
          <div className="max-w-2xl w-full space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg md:text-xl text-brown-700 leading-relaxed text-center">
              あなたの個人図書館を、ここBookshelf Appで管理しましょう。
              本の世界への扉を開き、あなたの読書生活をより豊かにするツールをご用意しています。
            </p>
            
            <ul className="space-y-3 sm:space-y-4">
              {[
                "持っている本の管理",
                "お気に入り作家の登録",
                "貸本の管理",
                "プロフィールの登録"
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-base sm:text-lg text-brown-800">{feature}</span>
                </li>
              ))}
            </ul>
            
            {!user && (
              <div className="mt-6 sm:mt-8 text-center">
                <Link href="/login" className="inline-block bg-brown-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-brown-700 transition duration-300">
                  始めましょう
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}