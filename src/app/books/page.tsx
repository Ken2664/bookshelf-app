"use client";

import React from 'react';
import { useBooks } from '../../hooks/useBooks';
import BookList from '../../components/BookList';
import SearchBar from '../../components/SearchBar';
import AuthGuard from '../../components/AuthGuard';

const BooksPage: React.FC = () => {
  const { books, loading, searchBooks } = useBooks();

  const handleSearch = async (title: string, author: string) => {
    await searchBooks(title, author);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">マイ本棚</h1>
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <BookList books={books} />
        )}
      </div>
    </AuthGuard>
  );
};

export default BooksPage;