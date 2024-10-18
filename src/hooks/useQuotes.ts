import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface QuoteData {
  id: string;
  content: string;
  author: string;
  book_title: string;
  page_number: number | null;
  user_id: string;
  book_id: string; // book_idを追加
  created_at: string;
  updated_at: string;
}

type NewQuoteData = Omit<QuoteData, 'id' | 'created_at' | 'updated_at' | 'book_id'>;

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const initialFetchDone = useRef(false);

  const fetchQuotes = useCallback(async () => {
    if (!user || initialFetchDone.current) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('引用の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
      initialFetchDone.current = true;
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user && !initialFetchDone.current) {
      fetchQuotes();
    }
  }, [authLoading, user, fetchQuotes]);

  const addQuote = useCallback(async (quoteData: NewQuoteData) => {
    if (!user) {
      setError('ユーザーが認証されていません');
      return null;
    }
    try {
      // book_titleを使ってbooksテーブルからbook_idを取得
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('id')
        .eq('title', quoteData.book_title)
        .eq('user_id', user.id)
        .single();

      if (bookError || !bookData) {
        throw new Error('指定された本が見つかりません');
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          ...quoteData,
          user_id: user.id,
          book_id: bookData.id, // 取得したbook_idを使用
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setQuotes(prevQuotes => [data, ...prevQuotes]);
      return data;
    } catch (error) {
      console.error('Error adding quote:', error);
      setError('引用の追加中にエラーが発生しました');
      throw error;
    }
  }, [user]);

  return {
    quotes,
    loading: authLoading || loading,
    error,
    addQuote,
    fetchQuotes,
  };
};
