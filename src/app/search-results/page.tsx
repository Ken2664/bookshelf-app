'use client';

import React, { useEffect } from 'react';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../../components/BookCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

const SearchResultsPage: React.FC = () => {
  const { searchResults, loading, searchBooks } = useBooks();
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || '';
  const author = searchParams.get('author') || '';
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      searchBooks(title, author);
    }
  }, [user, authLoading, searchBooks, title, author]);

  if (loading || authLoading) {
    return <div>検索結果を読み込んでいます...</div>;
  }

  if (!user) {
    return <div>ログインしてください。</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">検索結果</h1>
        <Link href="/books" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          一覧に戻る
        </Link>
      </div>
      {searchResults.length === 0 ? (
        <p>該当する本が見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;