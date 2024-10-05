"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import CameraCapture from '@/components/CameraCapture';
import { recognizeBook, BookInfo } from '@/lib/dify';
import BookForm from '@/components/BookForm';

export default function CameraCapturePage() {
  const router = useRouter();
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);

  const handleCapture = async (imageBase64: string) => {
    try {
      const recognizedBook = await recognizeBook(imageBase64);
      setBookInfo(recognizedBook);
    } catch (error) {
      console.error('本の認識に失敗しました:', error);
      alert('本の認識に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">カメラで本を追加</h1>
        {!bookInfo ? (
          <CameraCapture onCapture={handleCapture} />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">認識結果</h2>
            <BookForm initialData={bookInfo} />
            <button
              className="btn btn-secondary mt-4"
              onClick={() => setBookInfo(null)}
            >
              もう一度撮影する
            </button>
          </>
        )}
        <button
          className="btn btn-link mt-4"
          onClick={() => router.push('/books/add')}
        >
          手動入力に戻る
        </button>
      </div>
    </AuthGuard>
  );
}