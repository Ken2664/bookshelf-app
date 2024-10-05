import React from 'react';
import { Book } from '../types';
import Link from 'next/link';

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-2">著者: {book.author}</p>
          <p className="text-gray-600 mb-2">出版社: {book.publisher}</p>
          <p className="text-gray-600 mb-2">評価: {book.rating}/5</p>
          <p className="text-gray-600 mb-4">ステータス: {book.status}</p>
          <Link href={`/books/${book.id}`} className="text-blue-500 hover:underline">
            詳細を見る
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookList;