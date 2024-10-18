"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QuoteForm from '../../components/QuoteForm';
import QuoteList from '../../components/QuoteList';
import QuoteSearch from '../../components/QuoteSearch';
import { Quote } from '../../types';
import { useAuth } from '../../hooks/useAuth'; // カスタムフックを使用
import AuthGuard from '@/components/AuthGuard'; // AuthGuardをインポート

const QuotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchResults, setSearchResults] = useState<Quote[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleQuoteAdded = () => {
    setShowForm(false);
    // 必要に応じて、ここで検索結果を更新するロジックを追加
  };

  const handleError = (error: string) => {
    setPageError(error);
    // エラーに応じて適切な処理を行う（例：ログアウトしてログインページにリダイレクトするなど）
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;
  }

  if (!user) {
    return null; // または適切なリダイレクト処理
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">セリフ管理</h1>
        
        {pageError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{pageError}</span>
          </div>
        )}
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showForm ? 'フォームを閉じる' : 'セリフを追加'}
        </button>

        {showForm && <QuoteForm />}

        <QuoteSearch setSearchResults={setSearchResults} onError={handleError} />

        <QuoteList quotes={searchResults} onError={handleError} />
      </div>
    </AuthGuard>
  );
};

export default QuotesPage;
