"use client";

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (title: string, author: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(title, author);
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
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        検索
      </button>
    </form>
  );
};

export default SearchBar;