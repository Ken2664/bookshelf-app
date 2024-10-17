import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import RatingStars from './RatingStars';
import TagInput from './TagInput';
import { Tag, Book } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type BookFormData = Omit<Book, 'id' | 'user_id' | 'status' | 'favorite' | 'book_tags' | 'created_at' | 'updated_at' | 'cover_image'> & {
  cover_image?: string;
};
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
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('/api/upload-and-process', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const { bookInfo, coverUrl } = response.data;
        setFormData(prev => ({
          ...prev,
          title: bookInfo.title || prev.title,
          author: bookInfo.author || prev.author,
          publisher: bookInfo.publisher || prev.publisher,
        }));
        setCoverImageUrl(coverUrl);
      } catch (error) {
        console.error('画像処理エラー:', error);
        setError('本の情報の自動取得に失敗しました。手動で入力してください。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("ユーザーが認証されていません");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const bookData = {
        ...formData,
        user_id: user.id,
        status: 'unread' as const,
        favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // cover_imageがある場合のみ追加
      if (coverImageUrl) {
        bookData.cover_image = coverImageUrl;
      }

      const newBook = await addBook(bookData, selectedTags);

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
        setCoverImage(null);
        setCoverImageUrl('');

        // app/booksにリダイレクト
        router.push('/books');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("予期せぬエラーが発生しました。もう一度お試しください。");
      }
      console.error("本の追加中にエラーが発生しました:", error);
    } finally {
      setIsLoading(false);
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

      <TagInput
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラー: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? '処理中...' : '本を追加'}
      </button>
    </form>
  );
};

export default BookForm;