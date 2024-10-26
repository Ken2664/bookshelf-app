import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
    } else {
      setQuotes(data || []);
    }
    setLoading(false);
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.filter(quote => quote.id !== id));
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  };

  return { quotes, loading, deleteQuote };
};
