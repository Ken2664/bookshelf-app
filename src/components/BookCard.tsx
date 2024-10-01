import React, { useState } from 'react';
import { Book, BookStatus, BookTag } from '@/types';
import { useBooks } from '@/hooks/useBooks';
import RatingStars from './RatingStars';
import BookStatusSelect from './BookStatusSelect';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { updateBook, updateBookStatus } = useBooks();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(book.rating);
  const [comment, setComment] = useState<string>(book.comment);
  const [isFavorite, setIsFavorite] = useState<boolean>(book.favorite);

  const handleSave = () => {
    updateBook(book.id, { rating, comment, favorite: isFavorite });
    setIsEditing(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    updateBook(book.id, { favorite: !isFavorite });
  };

  const handleStatusChange = (newStatus: BookStatus) => {
    updateBookStatus(book.id, newStatus);
  };

  return (
    <div className="border p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-gray-600">著者: {book.author}</p>
          <p className="text-gray-600">出版社: {book.publisher}</p>
        </div>
        <button onClick={toggleFavorite} className="mt-2">
          {isFavorite ? (
            <SolidHeartIcon className="w-6 h-6 text-red-500" />
          ) : (
            <OutlineHeartIcon className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {book.BookTag && book.BookTag.map((bookTag: BookTag) => (
          <span key={bookTag.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
            {bookTag.Tag?.name || 'Unknown Tag'}
          </span>
        ))}
      </div>

      <div className="mt-2">
        <span className="font-semibold">進捗状態: </span>
        <BookStatusSelect status={book.status} onStatusChange={handleStatusChange} />
      </div>

      {isEditing ? (
        <div className="mt-2">
          <RatingStars rating={rating} setRating={setRating} />
          <textarea
            className="w-full mt-2 p-2 border rounded"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={100}
            placeholder="コメントを入力してください（最大100文字）"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <RatingStars rating={book.rating} readOnly />
          <p className="mt-2 text-gray-700">{book.comment}</p>
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setIsEditing(true)}
          >
            編集
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;