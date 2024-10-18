"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QuoteCard from '../../../components/QuoteCard';
import { Quote } from '../../../types';

const QuoteResultsPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const router = useRouter(); // useRouterを追加

  useEffect(() => {
    const fetchQuotes = async () => {
      const ids = searchParams.get('ids');
      if (ids) {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .in('id', ids.split(','));

        if (error) {
          console.error('Error fetching quotes:', error);
        } else {
          setQuotes(data || []);
        }
      }
    };

    fetchQuotes();
  }, [searchParams]);

  const handleRedirect = () => {
    router.push('/quotes'); // quotesページにリダイレクト
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">検索結果</h1>
      {quotes.length > 0 ? (
        quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
      ) : (
        <p>セリフが見つかりませんでした。</p>
      )}
      <button
        onClick={handleRedirect}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        セリフページに戻る
      </button>
    </div>
  );
};

export default QuoteResultsPage;
