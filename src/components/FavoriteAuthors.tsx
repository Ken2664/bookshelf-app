import React, { useEffect, useState } from 'react';
import { FavoriteAuthor } from '../types';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';

const FavoriteAuthors: React.FC = () => {
  const { user } = useAuth();
  const { favoriteAuthors, fetchFavoriteAuthors, addFavoriteAuthor, removeFavoriteAuthor } = useBooks();
  const [newAuthor, setNewAuthor] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchFavoriteAuthors();
    }
  }, [user, fetchFavoriteAuthors]);

  const handleAdd = async () => {
    if (newAuthor.trim() === '') return;
    await addFavoriteAuthor(newAuthor.trim());
    setNewAuthor('');
  };

  const handleRemove = async (id: string) => {
    await removeFavoriteAuthor(id);
  };

  if (!user) return null;

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-semibold">お気に入り作家</h3>
      <div className="mt-2 flex items-center space-x-2">
        <input
          type="text"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          placeholder="新しい作家を追加"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          追加
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {favoriteAuthors.map(author => (
          <li key={author.id} className="flex justify-between items-center">
            <span>{author.author_name}</span>
            <button
              type="button"
              onClick={() => handleRemove(author.id)}
              className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteAuthors;