"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import CameraCapture from '@/components/CameraCapture';
import { recognizeBook } from '@/lib/dify';
import { useBooks } from '@/hooks/useBooks';
import { Book, BookStatus } from '@/types';
import RatingStars from '@/components/RatingStars';
import BookStatusSelect from '@/components/BookStatusSelect';

export default function CameraAddBookPage() {
  const [bookInfo, setBookInfo] = useState<Partial<Book>>({
    title: '',
    author: '',
    publisher: '',
    rating: 0,
    status: 'unread' as BookStatus,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const { addBook } = useBooks();
  const router = useRouter();

  const handleCapture = async (imageBase64: string) => {
    setLoading(true);
    try {
      const recognizedInfo = await recognizeBook(imageBase64);
      setBookInfo(prevInfo => ({
        ...prevInfo,
        title: recognizedInfo.title,
        author: recognizedInfo.author,
        publisher: recognizedInfo.publisher,
      }));
    } catch (error) {
      console.error('本の認識に失敗しました:', error);
      alert('本の認識に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setBookInfo(prevInfo => ({ ...prevInfo, rating: newRating }));
  };

  const handleStatusChange = (newStatus: BookStatus) => {
    setBookInfo(prevInfo => ({ ...prevInfo, status: newStatus }));
  };

  const handleSave = async () => {
    try {
      await addBook({
        ...bookInfo,
        favorite: false,
      }, []);
      router.push('/books');
    } catch (error) {
      console.error('本の保存に失敗しました:', error);
      alert('本の保存に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">カメラで本を追加</h1>
        <CameraCapture onCapture={handleCapture} />
        {loading && <p className="mt-4">本の情報を認識中...</p>}
        {bookInfo.title && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">本の情報</h2>
            <div className="space-y-2">
              <input
                type="text"
                name="title"
                value={bookInfo.title}
                onChange={handleInputChange}
                placeholder="タイトル"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="author"
                value={bookInfo.author}
                onChange={handleInputChange}
                placeholder="著者"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="publisher"
                value={bookInfo.publisher}
                onChange={handleInputChange}
                placeholder="出版社"
                className="w-full p-2 border rounded"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">評価</label>
                <RatingStars rating={bookInfo.rating} setRating={handleRatingChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">進捗状況</label>
                <BookStatusSelect status={bookInfo.status} onChange={handleStatusChange} />
              </div>
              <textarea
                name="comment"
                value={bookInfo.comment}
                onChange={handleInputChange}
                placeholder="コメント"
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}