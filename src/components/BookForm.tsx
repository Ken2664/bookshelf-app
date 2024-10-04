import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import RatingStars from './RatingStars';
import TagInput from './TagInput';
import { Tag, Book } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

type BookFormData = Omit<Book, 'id' | 'user_id' | 'status' | 'favorite' | 'book_tags'>;

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
        status: 'unread', // デフォルトのステータス
        favorite: false, // デフォルトのお気に入り状態
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
      {/* 既存のフォームフィールド... */}
      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        本を追加
      </button>
    </form>
  );
};

export default BookForm;