import React, { useState, useEffect } from 'react';
import { Book, BookStatus, Tag } from '@/types';
import { useBooks } from '@/hooks/useBooks';
import RatingStars from './RatingStars';
import BookStatusSelect from './BookStatusSelect';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book: initialBook, onDelete }) => {
  const { updateBook, updateBookStatus, deleteBook } = useBooks();
  const [book, setBook] = useState<Book>(initialBook);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(initialBook.rating);
  const [comment, setComment] = useState<string>(initialBook.comment);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBook(initialBook);
    setRating(initialBook.rating);
    setComment(initialBook.comment);
    setIsLoading(false);
  }, [initialBook]);

  const handleSave = async () => {
    console.log('Saving book:', book.id, { rating, comment, favorite: book.favorite });
    const updatedBook = await updateBook(book.id, { rating, comment, favorite: book.favorite });
    if (updatedBook) {
      console.log('Book updated successfully:', updatedBook);
      setBook(updatedBook);
      setIsEditing(false);
    } else {
      console.error('Failed to update book');
    }
  };

  const toggleFavorite = async () => {
    const newFavoriteStatus = !book.favorite;
    console.log('Toggling favorite status:', book.id, newFavoriteStatus);
    const updatedBook = await updateBook(book.id, { favorite: newFavoriteStatus });
    if (updatedBook) {
      console.log('Favorite status updated successfully:', updatedBook);
      setBook(updatedBook);
    } else {
      console.error('Failed to update favorite status');
    }
  };

  const handleStatusChange = async (newStatus: BookStatus) => {
    console.log('Changing book status:', book.id, newStatus);
    // 即座にUIを更新
    setBook(prevBook => ({ ...prevBook, status: newStatus }));
    
    const updatedBook = await updateBookStatus(book.id, newStatus);
    if (updatedBook) {
      console.log('Book status updated successfully:', updatedBook);
      setBook(updatedBook);
    } else {
      console.error('Failed to update book status');
      // 更新に失敗した場合、元の状態に戻す
      setBook(prevBook => ({ ...prevBook, status: book.status }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('本当にこの本を削除しますか？')) {
      console.log('Deleting book:', book.id);
      await deleteBook(book.id);
      onDelete(book.id);
    }
  };

  if (isLoading || !book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-gray-600">著者: {book.author}</p>
          <p className="text-gray-600">出版社: {book.publisher}</p>
        </div>
        <div className="flex items-center">
          <button onClick={toggleFavorite} className="mr-2">
            {book.favorite ? (
              <SolidHeartIcon className="w-6 h-6 text-red-500" />
            ) : (
              <OutlineHeartIcon className="w-6 h-6 text-gray-500" />
            )}
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {book.book_tags && book.book_tags.map((bookTag) => (
          <span key={bookTag.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
            {bookTag.tag?.name || 'Unknown Tag'}
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
