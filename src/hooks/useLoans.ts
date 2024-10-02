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
    } else if (Array.isArray(data)) {
      setLoans([...data as Loan[], ...loans]);
    } else if (data) {
      setLoans([data as Loan, ...loans]);
    }
    setLoading(false);
  };

  const addLoan = async (loan: Omit<Loan, 'id'>) => {
    const { data, error } = await supabase
      .from('loans')
      .insert([{ ...loan, user_id: user?.id }])
      .maybeSingle();

    if (error) {
      console.error('Error adding loan:', error);
    } else if (data) {
      setLoans([data, ...loans]);
    }
    return data || null;
  };

  const updateLoan = async (id: string, returnDate: string) => {
    const { data, error } = await supabase
      .from('loans')
      .update({ return_date: returnDate })
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error updating loan:', error);
    } else {
      setLoans(loans.map(loan => loan.id === id ? data : loan).filter((loan): loan is Loan => loan !== null));
    }
    return data;
  };

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return { loans, loading, addLoan, updateLoan, fetchLoans };
};