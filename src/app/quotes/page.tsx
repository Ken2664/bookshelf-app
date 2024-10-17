"use client"

import React, { useState } from 'react';
import QuoteForm from '../../components/QuoteForm';
import QuoteList from '../../components/QuoteList';
import QuoteSearch from '../../components/QuoteSearch';
import { Quote } from '../../types';

const QuotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchResults, setSearchResults] = useState<Quote[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">セリフ管理</h1>
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {showForm ? 'フォームを閉じる' : 'セリフを追加'}
      </button>

      {showForm && <QuoteForm onQuoteAdded={() => setShowForm(false)} />}

      <QuoteSearch setSearchResults={setSearchResults} />

      <QuoteList quotes={searchResults} />
    </div>
  );
};

export default QuotesPage;
