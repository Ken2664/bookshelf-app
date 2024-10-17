"use client"

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types';
import { useRouter } from 'next/navigation';

interface QuoteFormProps {
  onQuoteAdded: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onQuoteAdded }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // 入力値の検証
      if (!content.trim()) {
        throw new Error('セリフを入力してください。');
      }
      if (!author.trim()) {
        throw new Error('著者名を入力してください。');
      }
      if (!bookTitle.trim()) {
        throw new Error('本のタイトルを入力してください。');
      }

      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('id')
        .eq('title', bookTitle)
        .single();

      if (bookError) {
        if (bookError.code === 'PGRST116') {
          throw new Error(`"${bookTitle}" という本が見つかりません。先に本を登録してください。`);
        } else {
          throw new Error('本の検索中にエラーが発生しました。');
        }
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          content,
          author,
          book_id: bookData?.id,
          page_number: pageNumber ? parseInt(pageNumber) : null,
        });

      if (error) throw error;

      alert('セリフが正常に登録されました。');
      setContent('');
      setAuthor('');
      setBookTitle('');
      setPageNumber('');
      onQuoteAdded(); // フォームが閉じられるように親コンポーネントに通知
    } catch (error) {
      console.error('Error adding quote:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('セリフの登録中に予期せぬエラーが発生しました。');
      }
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">
          本のタイトル
        </label>
        <input
          type="text"
          id="bookTitle"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="pageNumber" className="block text-sm font-medium text-gray-700">
          ページ番号（任意）
        </label>
        <input
          type="number"
          id="pageNumber"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
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
