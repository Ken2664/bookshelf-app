import { useState, useEffect } from 'react';
import { Book, Tag, BookTag, FavoriteAuthor, BookStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useBooks = () => {
  const { user } = useAuth();
  const user_id = user?.id || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoriteAuthors, setFavoriteAuthors] = useState<FavoriteAuthor[]>([]);

  useEffect(() => {
    if (user_id) {
      fetchBooks();
      fetchFavoriteAuthors();
    }
  }, [user_id]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Book')
      .select(`
        *,
        BookTag (
          id,
          book_id,
          tag_id,
          Tag (
            id,
            name,
            user_id
          )
        )
      `)
      .eq('user_id', user_id)
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching books:', error);
    } else if (data) {
      const booksWithTags = data.map((book: Book & { BookTag: BookTag[] }) => ({
        ...book,
        tags: book.BookTag?.map((bt: BookTag) => bt.Tag) || [],
      }));
      setBooks(booksWithTags);
    }
    setLoading(false);
  };

  const addBook = async (book: Omit<Book, 'id' | 'BookTag'>): Promise<Book | null> => {
    const { data, error } = await supabase
      .from('Book')
      .insert(book)
      .select()
      .single();

    if (error) {
      console.error('Error adding book:', error);
      return null;
    } else if (data) {
      setBooks(prevBooks => [...prevBooks, data]);
      return data;
    }
    return null;
  };

  const updateBook = async (id: string, updatedFields: Partial<Book>) => {
    const { data, error } = await supabase
      .from('Book')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book:', error);
    } else if (data) {
      setBooks(prevBooks => prevBooks.map(book => (book.id === id ? data : book)));
    }
    return data;
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase
      .from('Book')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting book:', error);
    } else {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    }
  };

  const assignTagToBook = async (bookId: string, tagId: string) => {
    const { error } = await supabase
      .from('BookTag')
      .insert({ book_id: bookId, tag_id: tagId });

    if (error) {
      console.error('Error assigning tag to book:', error);
    }
  };

  const fetchFavoriteAuthors = async () => {
    const { data, error } = await supabase
      .from('FavoriteAuthor')
      .select('*')
      .eq('user_id', user_id)
      .order('author_name', { ascending: true });

    if (error) {
      console.error('Error fetching favorite authors:', error);
    } else if (data) {
      setFavoriteAuthors(data);
    }
  };

  const addFavoriteAuthor = async (author_name: string) => {
    const { data, error } = await supabase
      .from('FavoriteAuthor')
      .insert({ user_id, author_name })
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite author:', error);
    } else if (data) {
      setFavoriteAuthors(prev => [...prev, data]);
    }
    return data;
  };

  const removeFavoriteAuthor = async (id: string) => {
    const { error } = await supabase
      .from('FavoriteAuthor')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing favorite author:', error);
    } else {
      setFavoriteAuthors(prev => prev.filter(author => author.id !== id));
    }
  };

  const updateBookStatus = async (id: string, status: BookStatus) => {
    const { data, error } = await supabase
      .from('Book')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book status:', error);
    } else if (data) {
      setBooks(prevBooks => prevBooks.map(book => book.id === id ? { ...book, status } : book));
    }
    return data;
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    assignTagToBook,
    favoriteAuthors,
    fetchFavoriteAuthors,
    addFavoriteAuthor,
    removeFavoriteAuthor,
    updateBookStatus,
  };
};