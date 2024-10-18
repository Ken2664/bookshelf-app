import React from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <p className="text-lg">{quote.content}</p>
      <p className="text-sm text-gray-500">- {quote.author}</p>
    </div>
  );
};

export default QuoteCard;
