"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useQuotes } from '../hooks/useQuotes';

const QuoteForm: React.FC = () => {
  const { addQuote } = useQuotes();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    book_title: '',
    page_number: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const quoteData = {
        ...formData,
        book_title: formData.book_title, // book_titleをbook_titleに変更
        page_number: formData.page_number ? parseInt(formData.page_number) : null,
        user_id: user.id,
      };

      const newQuote = await addQuote(quoteData);

      if (newQuote) {
        setFormData({
          content: '',
          author: '',
          book_title: '',
          page_number: '',
        });

        router.push('/quotes');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("予期せぬエラーが発生しました。もう一度お試しください。");
      }
      console.error("セリフの追加中にエラーが発生しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          セリフ
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={3}
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
        <label htmlFor="book_title" className="block text-sm font-medium text-gray-700">
          本のタイトル
        </label>
        <input
          type="text"
          id="book_title"
          name="book_title"
          value={formData.book_title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="page_number" className="block text-sm font-medium text-gray-700">
          ページ番号（任意）
        </label>
        <input
          type="number"
          id="page_number"
          name="page_number"
          value={formData.page_number}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      
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
        {isLoading ? '登録中...' : 'セリフを登録'}
      </button>
    </form>
  );
};

export default QuoteForm;
