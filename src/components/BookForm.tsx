import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import RatingStars from './RatingStars';
import TagInput from './TagInput';
import { Tag } from '../types';
import { useAuth } from '../hooks/useAuth';

const BookForm: React.FC = () => {
  const { addBook } = useBooks();
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newBook = await addBook({
      user_id: user.id,
      title,
      author,
      publisher,
      rating,
      comment,
      status: 'unread',
      favorite: false,
    });

    // タグの割り当ては別の関数で行う
    if (newBook) {
      await Promise.all(selectedTags.map(tag => assignTagToBook(newBook.id, tag.id)));
    }

    // フォームをリセット
    setTitle('');
    setAuthor('');
    setPublisher('');
    setRating(0);
    setComment('');
    setSelectedTags([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="著者"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
        placeholder="出版社"
        required
        className="w-full p-2 border rounded"
      />
      <RatingStars rating={rating} setRating={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
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