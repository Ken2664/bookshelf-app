import React, { useState, useMemo } from 'react';
import Image from 'next/image';

interface RecommendedBookCardProps {
  title: string;
  author: string;
  publisher: string;
  description: string;
  thumbnail?: string;
}

const RecommendedBookCard: React.FC<RecommendedBookCardProps> = ({ title, author, publisher, description, thumbnail }) => {
  const [imageError, setImageError] = useState(false);

  const highResolutionThumbnail = useMemo(() => {
    if (!thumbnail) return '';
    const url = new URL(thumbnail);
    url.searchParams.set('zoom', '3');  // より高解像度の画像を要求
    return url.toString();
  }, [thumbnail]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full">
      <div className="flex-shrink-0 mb-4 relative aspect-[3/4] w-full">
        {highResolutionThumbnail && !imageError ? (
          <Image
            src={highResolutionThumbnail}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">画像なし</span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-1">著者: {author}</p>
        <p className="text-gray-600 mb-2">出版社: {publisher}</p>
        {description && description !== "No description available" && (
          <p className="text-gray-700 text-sm line-clamp-3">あらすじ: {description}</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedBookCard;
