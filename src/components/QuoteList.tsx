import React from 'react';
import { Quote } from '../types';

interface QuoteListProps {
  quotes: Quote[];
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes }) => {
  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="border p-4 rounded shadow">
          <p className="text-lg font-semibold">{quote.content}</p>
          <p className="text-sm text-gray-600">著者: {quote.author}</p>
          <p className="text-sm text-gray-600">ページ: {quote.page_number || '不明'}</p>
        </div>
      ))}
    </div>
  );
};

export default QuoteList;
