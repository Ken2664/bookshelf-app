"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QuoteForm from '../../components/QuoteForm';
import QuoteSearch from '../../components/QuoteSearch';
import QuoteCard from '../../components/QuoteCard';
import { Quote } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';

const QuotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [randomQuotes, setRandomQuotes] = useState<Quote[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchRandomQuotes = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          handleError(error.message);
        } else if (data) {
          const shuffled = data.sort(() => 0.5 - Math.random());
          setRandomQuotes(shuffled.slice(0, 5));
        }
      }
    };

    fetchRandomQuotes();
  }, [user]);

  const handleQuoteAdded = () => {
    setShowForm(false);
  };

  const handleError = (error: string) => {
    setPageError(error);
  };

  const handleSearchResults = (results: Quote[]) => {
    const query = results.map((quote) => quote.id).join(',');
    router.push(`/quotes/results?ids=${query}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;
  }

  if (!user) {
    return null;
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

        <QuoteSearch setSearchResults={handleSearchResults} onError={handleError} />

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">ランダムなセリフ</h2>
          {randomQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      </div>
    </AuthGuard>
  );
};

export default QuotesPage;
