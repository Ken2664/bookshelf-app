import React from 'react';

interface RecommendedBookCardProps {
  title: string;
  author: string;
  publisher: string;
  description: string;
  thumbnail?: string;
}

const RecommendedBookCard: React.FC<RecommendedBookCardProps> = ({ title, author, publisher, description, thumbnail }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded" />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-1">著者: {author}</p>
        <p className="text-gray-600 mb-2">出版社: {publisher}</p>
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default RecommendedBookCard;
