'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../../components/BookCard';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { BookStatus, Tag } from '@/types';
import TagInput from '@/components/TagInput';

const SearchResultsPage: React.FC = () => {
  const { searchResults, loading, searchBooks } = useBooks();
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || '';
  const author = searchParams.get('author') || '';
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(() => {
    if (user && !authLoading && !hasSearched) {
      const tagObjects = tagIds.map(id => ({ id, name: '', user_id: user.id }));
      searchBooks(title, author, tagObjects);
      setHasSearched(true);
    }
  }, [user, authLoading, hasSearched, searchBooks, title, author, tagIds]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleStatusFilterChange = (status: BookStatus | 'all') => {
    setStatusFilter(status);
  };

  const filteredAndSortedBooks = searchResults
    .filter(book => statusFilter === 'all' || book.status === statusFilter)
    .sort((a, b) => a.title.localeCompare(b.title));

  // 検索条件を表示するための関数
  const renderSearchCriteria = () => {
    const criteria = [];
    if (title) criteria.push(`タイトル: "${title}"`);
    if (author) criteria.push(`著者: "${author}"`);
    if (searchResults.length > 0 && searchResults[0].book_tags) {
      const tagNames = searchResults[0].book_tags.map(tag => tag.tag.name).join(', ');
      if (tagNames) criteria.push(`タグ: ${tagNames}`);
    }
    return criteria.length > 0 ? criteria.join(', ') : 'すべての本';
  };

  if (loading || authLoading) {
    return <div>検索結果を読み込んでいます...</div>;
  }

  if (!user) {
    return <div>ログインしてください。</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">検索結果</h1>
        <Link href="/books" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          一覧に戻る
        </Link>
      </div>
      
      {/* 検索条件の表示 */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">検索条件:</h2>
        <p>{renderSearchCriteria()}</p>
      </div>

      <div className="mb-4">
        <span className="mr-2">進捗状態でフィルタ:</span>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value as BookStatus | 'all')}
          className="p-2 border rounded"
        >
          <option value="all">すべて</option>
          <option value="unread">未読</option>
          <option value="reading">読書中</option>
          <option value="completed">読了</option>
        </select>
      </div>

      {filteredAndSortedBooks.length === 0 ? (
        <p>該当する本が見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;