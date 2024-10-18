"use client"

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Quote } from '../types';

interface QuoteSearchProps {
  onSearchResults: (results: Quote[]) => void;
  onError: (error: string) => void;
}

const QuoteSearch: React.FC<QuoteSearchProps> = ({ onSearchResults, onError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'content' | 'author' | 'book_title'>('content');

  const supabase = createClientComponentClient<Database>();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let query = supabase.from('quotes').select('*');

    if (searchType === 'book_title') {
      query = query.eq('book_id', supabase.from('books').select('id').eq('title', searchTerm).single());
    } else {
      query = query.ilike(searchType, `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('検索エラー:', error);
      onError(error.message);
      return;
    }

    onSearchResults(data || []);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="検索キーワード"
        className="mr-2 p-2 border rounded"
      />
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as 'content' | 'author' | 'book_title')}
        className="mr-2 p-2 border rounded"
      >
        <option value="content">セリフ</option>
        <option value="author">著者</option>
        <option value="book_title">本のタイトル</option>
      </select>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        検索
      </button>
    </form>
  );
};

export default QuoteSearch;
