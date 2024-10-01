"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';
import AuthGuard from '@/components/AuthGuard';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setBook(data);
      }
      setLoading(false);
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error || !book) {
    return <p className="text-red-500">エラーが発生しました: {error}</p>;
  }

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <p className="mt-2 text-lg">著者: {book.author}</p>
        <p className="mt-2 text-lg">出版社: {book.publisher}</p>
        <p className="mt-2 text-yellow-500">評価: {'★'.repeat(book.rating)}</p>
        <p className="mt-4">{book.comment}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          戻る
        </button>
      </div>
    </AuthGuard>
  );
}