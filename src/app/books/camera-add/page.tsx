"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import CameraCapture from '@/components/CameraCapture';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';
import { Book, BookStatus, Tag } from '@/types';
import RatingStars from '@/components/RatingStars';
import BookStatusSelect from '@/components/BookStatusSelect';
import TagInput from '@/components/TagInput';
import Image from 'next/image';
import axios from 'axios';

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export default function CameraAddBookPage() {
  const [bookInfo, setBookInfo] = useState<Partial<Book>>({
    title: '',
    author: '',
    publisher: '',
    rating: 0,
    status: 'unread' as BookStatus,
    comment: '',
    cover_image: '',
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const { addBook } = useBooks();
  const router = useRouter();
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload' | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCapture = async (imageBase64: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(imageBase64), 'image.jpg');

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { bookInfo: recognizedInfo, coverUrl } = response.data;
      setBookInfo(prevInfo => ({
        ...prevInfo,
        title: recognizedInfo.title || '',
        author: recognizedInfo.author || '',
        publisher: recognizedInfo.publisher || '',
        cover_image: coverUrl,
      }));
      setPreviewImage(coverUrl);
    } catch (error) {
      console.error('本の認識に失敗しました:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        alert(`本の認識に失敗しました: ${error.response?.data?.error || error.message}`);
      } else if (error instanceof Error) {
        alert(`本の認識に失敗しました: ${error.message}`);
      } else {
        alert('本の認識に失敗しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        handleCapture(base64String);
      };
      reader.readAsDataURL(file);
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
    if (!user) {
      alert('ユーザーが認証されていません。ログインしてください。');
      return;
    }

    if (!bookInfo.title) {
      alert('タイトルは必須です。');
      return;
    }

    try {
      const newBook: Omit<Book, 'id' | 'book_tags' | 'cover_image'> = {
        title: bookInfo.title,
        author: bookInfo.author || '',
        publisher: bookInfo.publisher || '',
        rating: bookInfo.rating || 0,
        status: bookInfo.status || 'unread',
        comment: bookInfo.comment || '',
        favorite: false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const addedBook = await addBook(newBook, selectedTags);
      if (addedBook) {
        console.log('本が正常に追加されました:', addedBook);
        router.push('/books');
      } else {
        throw new Error('本の追加に失敗しました');
      }
    } catch (error) {
      console.error('本の保存に失敗しました:', error);
      alert('本の保存に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">カメラまたは画像アップロードで本を追加</h1>
        
        {!captureMethod && (
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setCaptureMethod('camera')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              カメラを使用
            </button>
            <button
              onClick={() => setCaptureMethod('upload')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              画像をアップロード
            </button>
          </div>
        )}

        {captureMethod === 'camera' && <CameraCapture onCapture={handleCapture} />}

        {captureMethod === 'upload' && (
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="mb-2"
            />
            {previewImage && (
              <div className="mt-2">
                <Image src={previewImage} alt="プレビュー" width={200} height={200} />
              </div>
            )}
          </div>
        )}

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
                required
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
                <RatingStars rating={bookInfo.rating || 0} setRating={handleRatingChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">進捗状況</label>
                <BookStatusSelect 
                  status={bookInfo.status || 'unread'} 
                  onStatusChange={handleStatusChange} 
                />
              </div>
              <textarea
                name="comment"
                value={bookInfo.comment}
                onChange={handleInputChange}
                placeholder="コメント"
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">タグ</label>
                <TagInput
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              </div>
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