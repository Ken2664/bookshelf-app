"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import RecommendedBookCard from '@/components/RecommendedBookCard';
import AuthGuard from '@/components/AuthGuard';
import { fetchGoogleBooksInfo } from '@/lib/googleBooks';
import { RecommendedBook } from '@/types';

const RecommendedBooksPage = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('recommended_books')
          .select('book_title, book_author, book_publisher')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const booksWithDetails = await Promise.all(
            data.map(async (book) => {
              const googleBookInfo = await fetchGoogleBooksInfo(book.book_title, book.book_author);
              return {
                ...book,
                ...googleBookInfo
              };
            })
          );
          setRecommendedBooks(booksWithDetails);
        }
      } catch (error) {
        console.error('おすすめの本の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, [user]);

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">おすすめの本</h1>
        {loading ? (
          <p>読み込み中...</p>
        ) : recommendedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedBooks.map((book, index) => (
              <RecommendedBookCard
                key={index}
                title={book.title ?? book.book_title ?? ''}
                author={book.author ?? book.book_author ?? ''}
                publisher={book.publisher ?? book.book_publisher ?? ''}
                description={book.description ?? ''}
                thumbnail={book.thumbnail ?? ''}
              />
            ))}
          </div>
        ) : (
          <p>おすすめの本がありません。</p>
        )}
      </div>
    </AuthGuard>
  );
};

export default RecommendedBooksPage;
