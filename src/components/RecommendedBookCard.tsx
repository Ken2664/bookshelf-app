import React from 'react';

interface RecommendedBookProps {
  title: string;
  author: string;
  publisher: string;
}

const RecommendedBookCard: React.FC<RecommendedBookProps> = ({ title, author, publisher }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-1">著者: {author}</p>
      <p className="text-gray-600">出版社: {publisher}</p>
    </div>
  );
};

export default RecommendedBookCard;
