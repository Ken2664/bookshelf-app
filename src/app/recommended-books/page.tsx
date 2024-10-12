"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import BookCard from '@/components/BookCard';
import { Book } from '@/types';
import AuthGuard from '@/components/AuthGuard';

const RecommendedBooksPage = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!user) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;

        const { data, error } = await supabase
          .from('recommended_books')
          .select(`
            book_id,
            books:book_id (
              id,
              title,
              author,
              publisher,
              rating,
              comment,
              favorite,
              status,
              book_tags (
                id,
                tag (
                  id,
                  name
                )
              )
            )
          `)
          .eq('user_id', userData.id);

        if (error) throw error;

        setRecommendedBooks(data.flatMap(item => item.books.map(book => ({
          id: book.id,
          //user_id: book.user_id,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          rating: book.rating,
          comment: book.comment,
          favorite: book.favorite,
          status: book.status,
          book_tags: book.book_tags.map(tag => ({
            book_id: book.id,
            tag_id: tag.tag[0].id,
            //user_id: book.user_id,
            id: tag.id
          })),
        } as Book))));
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
          <div className="grid grid-cols-1 gap-4">
            {recommendedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
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
