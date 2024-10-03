import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import RatingStars from './RatingStars';
import TagInput from './TagInput';
import { Tag, Book } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type BookFormData = Omit<Book, 'id' | 'user_id' | 'status' | 'favorite' | 'BookTag'>;

const BookForm: React.FC = () => {
  const { addBook, assignTagToBook } = useBooks();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    publisher: '',
    rating: 0,
    comment: '',
    bookTag: [],
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
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            ...formData,
            user_id: user.id,
            status: 'unread',
            favorite: false,
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const newBook = data[0] as Book;
        await Promise.all(selectedTags.map(tag => assignTagToBook(newBook.id, tag.id)));
        
        // フォームをリセット
        setFormData({
          title: '',
          author: '',
          publisher: '',
          rating: 0,
          comment: '',
          bookTag: [],
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
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="タイトル"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="著者"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        placeholder="出版社"
        required
        className="w-full p-2 border rounded"
      />
      <RatingStars rating={formData.rating} setRating={(rating) => setFormData(prev => ({ ...prev, rating }))} />
      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        placeholder="コメント（最大100文字）"
        maxLength={100}
        className="w-full p-2 border rounded"
      />
      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        本を追加
      </button>
    </form>
  );
};

export default BookForm;