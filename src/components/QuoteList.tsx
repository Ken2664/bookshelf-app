import React from 'react';
import { Quote } from '../types';

interface QuoteListProps {
  quotes: Quote[];
  onError: (error: string) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, onError }) => {
  if (!quotes) {
    onError('引用が見つかりませんでした。');
    return null;
  }

  return (
    <div>
      {quotes.map((quote) => (
        <div key={quote.id} className="mb-4 p-4 border rounded">
          <p className="text-lg">"{quote.content}"</p>
          <p className="text-right mt-2">- {quote.author}</p>
        </div>
      ))}
    </div>
  );
};

export default QuoteList;
