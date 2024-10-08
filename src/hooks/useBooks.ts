import { useState, useEffect, useCallback, useRef } from 'react';
import { Book, BookTag, FavoriteAuthor, BookStatus, Tag } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useBooks = () => {
  const { user, loading: authLoading } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoriteAuthors, setFavoriteAuthors] = useState<FavoriteAuthor[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const initialFetchDone = useRef(false);

  const fetchBooks = useCallback(async () => {
    if (!user || initialFetchDone.current) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_tags (
          id,
          tag_id,
          tag:tags (id, name)
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
    initialFetchDone.current = true;
  }, [user]);

  const fetchFavoriteAuthors = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('favorite_authors')
      .select('*')
      .eq('user_id', user.id)
      .order('author_name', { ascending: true });

    if (error) {
      console.error('Error fetching favorite authors:', error);
    } else if (data) {
      setFavoriteAuthors(data);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user && !initialFetchDone.current) {
      fetchBooks();
      fetchFavoriteAuthors();
    }
  }, [authLoading, user, fetchBooks, fetchFavoriteAuthors]);

  const addBook = async (newBook: Omit<Book, 'id' | 'book_tags' | 'cover_image'>, tags: Tag[]) => {
    try {
      // 1. 本を追加
      const { data: insertedBook, error: insertError } = await supabase
        .from('books')
        .insert([newBook])
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. タグを関連付け
      if (insertedBook && tags.length > 0) {
        const bookTags = tags.map(tag => ({
          book_id: insertedBook.id,
          tag_id: tag.id,
          user_id: user?.id // ここでuser_idを追加
        }));

        const { error: tagError } = await supabase
          .from('book_tags')
          .insert(bookTags);

        if (tagError) throw tagError;
      }

      // 3. 本のリストを更新
      await fetchBooks();

      return insertedBook;
    } catch (error) {
      console.error('本の追加に失敗しました:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, updatedFields: Partial<Book>) => {
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
  
    console.log('Updating book:', id, updatedFields, 'User ID:', user.id);
  
    const { data, error } = await supabase
      .from('books')
      .update(updatedFields)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.error('Error updating book:', error);
      return null;
    }
  
    if (!data || data.length === 0) {
      console.error('No book found with the given id:', id, 'for user:', user.id);
      return null;
    }

    const updatedBook = data[0];
    setBooks(prevBooks => prevBooks.map(book => (book.id === id ? updatedBook : book)));
    return updatedBook;
  };

  const deleteBook = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting book:', error);
    } else {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    }
  };

  const assignTagToBook = async (bookId: string, tagId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('book_tags')
      .insert({ book_id: bookId, tag_id: tagId, user_id: user.id });

    if (error) {
      console.error('Error assigning tag to book:', error);
    }
  };

  const addFavoriteAuthor = async (author_name: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('favorite_authors')
      .insert({ user_id: user.id, author_name })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error adding favorite author:', error);
    } else if (data) {
      setFavoriteAuthors(prev => [...prev, data]);
    }
    return data;
  };

  const removeFavoriteAuthor = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('favorite_authors')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing favorite author:', error);
    } else {
      setFavoriteAuthors(prev => prev.filter(author => author.id !== id));
    }
  };

  const updateBookStatus = async (id: string, status: BookStatus): Promise<Book | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('books')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book status:', error);
      return null;
    } else if (data) {
      setBooks(prevBooks => prevBooks.map(book => book.id === id ? data : book));
      return data;
    }
    return null;
  };

  const searchBooks = useCallback(async (title: string, author: string, tags: Tag[]) => {
    if (!user) {
      console.error('検索エラー: ユーザーが認証されていません');
      return;
    }
    setLoading(true);
    console.log(`検索開始: タイトル "${title}", 著者 "${author}", タグ ${tags.map(t => t.name).join(', ')}`);

    let query = supabase
      .from('books')
      .select(`
        *,
        book_tags!inner (
          id,
          tag:tags!inner (id, name)
        )
      `)
      .eq('user_id', user.id);

    if (title) {
      query = query.ilike('title', `%${title}%`);
    }
    if (author) {
      query = query.ilike('author', `%${author}%`);
    }
    if (tags.length > 0) {
      const tagIds = tags.map(tag => tag.id);
      query = query.in('book_tags.tag.id', tagIds);
    }

    try {
      const { data, error } = await query.order('title', { ascending: true });

      if (error) {
        console.error('本の検索中にエラーが発生しました:', error);
        throw error;
      } else if (data) {
        console.log(`検索結果: ${data.length}件の本が見つかりました`);
        // タグでフィルタリングされた結果のみを返す
        const filteredData = tags.length > 0
          ? data.filter(book => book.book_tags.some((bt: any) => tags.some(t => t.id === bt.tag.id)))
          : data;
        
        // タグの名前を含む形式に変換
        const booksWithTagNames = filteredData.map(book => ({
          ...book,
          tags: book.book_tags.map((bt: any) => bt.tag.name)
        }));
        
        setSearchResults(booksWithTagNames);
      } else {
        console.log('検索結果: 本が見つかりませんでした');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('検索中に予期せぬエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    books,
    loading: authLoading || loading,
    addBook,
    updateBook,
    deleteBook,
    assignTagToBook,
    favoriteAuthors,
    fetchFavoriteAuthors,
    addFavoriteAuthor,
    removeFavoriteAuthor,
    updateBookStatus,
    searchResults,
    searchBooks,
  };
};