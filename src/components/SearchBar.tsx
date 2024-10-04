"use client";

import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useRouter } from 'next/navigation';

const SearchBar: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { searchBooks, loading } = useBooks();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('検索フォーム送信:', { title, author });
    try {
      await searchBooks(title, author);
      router.push(`/search-results?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
      <div className="flex-1 mb-4 md:mb-0">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルで検索"
        />
      </div>
      <div className="flex-1 mb-4 md:mb-0">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="著者名で検索"
        />
      </div>
      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? '検索中...' : '検索'}
      </button>
    </form>
  );
};

export default SearchBar;