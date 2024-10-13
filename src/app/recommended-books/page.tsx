"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import RecommendedBookCard from '@/components/RecommendedBookCard';
import AuthGuard from '@/components/AuthGuard';
import { RecommendedBook, DisplayBook } from '@/types';


const RecommendedBooksPage = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<DisplayBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('recommended_books')
          .select('book_title, book_author, book_publisher')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setRecommendedBooks([{
            title: data.book_title,
            author: data.book_author,
            publisher: data.book_publisher
          }]);
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
                title={book.title}
                author={book.author}
                publisher={book.publisher}
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