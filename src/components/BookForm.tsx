import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import RatingStars from './RatingStars';
import TagInput from './TagInput';
import { Tag, Book } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

type BookFormData = Omit<Book, 'id' | 'user_id' | 'status' | 'favorite' | 'book_tags' | 'created_at' | 'updated_at'>;

const BookForm: React.FC = () => {
  const { addBook } = useBooks();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    publisher: '',
    rating: 0,
    comment: '',
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("ユーザーが認証されていません");
      return;
    }
    
    try {
      const newBook = await addBook({
        ...formData,
        user_id: user.id,
        status: 'unread' as const,
        favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, selectedTags);
      if (newBook) {
        // フォームをリセット
        setFormData({
          title: '',
          author: '',
          publisher: '',
          rating: 0,
          comment: '',
        });
        setSelectedTags([]);

        // app/booksにリダイレクト
        router.push('/books');
      }
    } catch (error) {
      console.error("本の追加中にエラーが発生しました:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          著者
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
          出版社
        </label>
        <input
          type="text"
          id="publisher"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          評価
        </label>
        <RatingStars
          rating={formData.rating}
          setRating={(newRating) => setFormData(prev => ({ ...prev, rating: newRating }))}
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          コメント
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        本を追加
      </button>
    </form>
  );
};

export default BookForm;