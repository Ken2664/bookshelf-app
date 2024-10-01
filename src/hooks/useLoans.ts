import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loan } from '@/types';
import { useAuth } from './useAuth';

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLoans = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', user.id)
      .order('loan_date', { ascending: false });

    if (error) {
      console.error('Error fetching loans:', error);
    } else {
      setLoans(data || []);
    }
    setLoading(false);
  };

  const addLoan = async (loan: Omit<Loan, 'id'>) => {
    const { data, error } = await supabase
      .from('loans')
      .insert([{ ...loan, user_id: user?.id }])
      .single();

    if (error) {
      console.error('Error adding loan:', error);
    } else {
      setLoans([data, ...loans]);
    }
    return data;
  };

  const updateLoan = async (id: string, returnDate: string) => {
    const { data, error } = await supabase
      .from('loans')
      .update({ return_date: returnDate })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error updating loan:', error);
    } else {
      setLoans(loans.map(loan => loan.id === id ? data : loan));
    }
    return data;
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  return { loans, loading, addLoan, updateLoan, fetchLoans };
};