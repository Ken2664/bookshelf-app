import { useState, useEffect, useCallback, useRef } from 'react';
import { Book, FavoriteAuthor, BookStatus, Tag } from '../types';
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
      console.error('本の削除中にエラーが発生しました:', error);
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

  const searchBooks = async (title: string, author: string, tags: Tag[]) => {
    setLoading(true)
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          book_tags (
            tag (*)
          )
        `)
        .eq('user_id', user?.id)

      if (title) {
        query = query.ilike('title', `%${title}%`)
      }

      // 著者名の OR 検索処理
      if (author) {
        if (author.includes('|')) {
          // OR検索の場合
          const authorNames = author.split('|')
          query = query.or(
            authorNames.map(name => `author.ilike.%${name}%`).join(',')
          )
        } else {
          // 単一著者の検索
          query = query.ilike('author', `%${author}%`)
        }
      }

      if (tags.length > 0) {
        const { data: bookIdsWithTags } = await supabase
          .from('book_tags')
          .select('book_id')
          .in('tag_id', tags.map(tag => tag.id))

        if (bookIdsWithTags) {
          query = query.in('id', bookIdsWithTags.map(item => item.book_id))
        }
      }

      const { data, error } = await query

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Error searching books:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  };

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
