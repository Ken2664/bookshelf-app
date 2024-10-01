import React from 'react';

interface RatingStarsProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, setRating, readOnly = false }) => {
  const handleClick = (value: number) => {
    if (!readOnly && setRating) {
      setRating(value);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <svg
          key={value}
          onClick={() => handleClick(value)}
          className={`w-6 h-6 cursor-pointer ${
            value <= rating ? 'text-yellow-500' : 'text-gray-300'
          } ${readOnly ? 'pointer-events-none' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.377 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.98 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;