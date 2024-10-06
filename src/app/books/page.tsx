"use client";

import AuthGuard from '@/components/AuthGuard';
import { useBooks } from '@/hooks/useBooks';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { Book } from '@/types';

export default function BooksPage() {
  const { books, loading } = useBooks();

  const sortedBooks = books.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <AuthGuard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">本の一覧</h1>
        </div>
        <div className="mt-4 mb-5 flex flex-col sm:flex-row sm:justify-between">
          <Link href="/books/add" className="px-4 py-2 bg-blue-500 text-white rounded mb-2 sm:mb-0">
            本を追加
          </Link>
          <Link href="/books/camera-add" className="px-4 py-2 bg-green-500 text-white rounded">
            画像から追加
          </Link>
        </div>
        <SearchBar />
        {loading && <p>読み込み中...</p>}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
      </div>
    </AuthGuard>
  );
}