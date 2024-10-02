"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/hooks/useBooks';
import { useUserProfile } from '@/hooks/useUserProfile';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const { books } = useBooks();
  const { profile, loading, error } = useUserProfile();

  if (!user) return null;

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">マイページ</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-2">ユーザー情報</h2>
          <p><strong>メールアドレス:</strong> {user.email}</p>
          <p><strong>ユーザーネーム:</strong> {loading ? '読み込み中...' : (profile?.username || '未設定')}</p>
          {error && <p className="text-red-500">ユーザー情報の取得に失敗しました</p>}
          <p><strong>登録した本の総数:</strong> {books.length}</p>
          <Link href="/profile" className="text-blue-500 hover:underline">
            プロフィールを編集
          </Link>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-2">読書の統計</h2>
          <p><strong>読了した本:</strong> {books.filter(book => book.status === 'completed').length}</p>
          <p><strong>読書中の本:</strong> {books.filter(book => book.status === 'reading').length}</p>
          <p><strong>未読の本:</strong> {books.filter(book => book.status === 'unread').length}</p>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-2">新作アナウンス</h2>
          <p>この機能は近日公開予定です。</p>
        </div>
      </div>
    </AuthGuard>
  );
};

export default MyPage;