"use client";

import AuthGuard from '@/components/AuthGuard';
import { useBooks } from '@/hooks/useBooks';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';
import axios from 'axios';
import { Book, BookStatus } from '@/types';

export default function BooksPage() {
  const { books, loading } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all');

  const handleSearch = async (title: string, author: string) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await axios.get('/api/search', {
        params: { title, author },
      });
      setFilteredBooks(response.data);
    } catch (err: any) {
      setSearchError(err.response?.data?.error || '検索に失敗しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStatusFilterChange = (status: BookStatus | 'all') => {
    setStatusFilter(status);
  };

  const filteredAndSortedBooks = (isSearching ? filteredBooks : books)
    .filter(book => statusFilter === 'all' || book.status === statusFilter)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <AuthGuard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">本の一覧</h1>
          <Link href="/books/add" className="px-4 py-2 bg-blue-500 text-white rounded">
            本を追加
          </Link>
        </div>
        <SearchBar onSearch={handleSearch} />
        <div className="mb-4">
          <span className="mr-2">進捗状態でフィルタ:</span>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as BookStatus | 'all')}
            className="p-2 border rounded"
          >
            <option value="all">すべて</option>
            <option value="unread">未読</option>
            <option value="reading">読書中</option>
            <option value="completed">読了</option>
          </select>
        </div>
        {isSearching && <p>検索中...</p>}
        {searchError && <p className="text-red-500">{searchError}</p>}
        {loading && !isSearching && <p>読み込み中...</p>}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}