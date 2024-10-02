import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loan } from '@/types';

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('loans')
      .select('*')
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
      .insert([loan])
      .select();

    if (error) {
      console.error('Error adding loan:', error);
    } else if (data) {
      setLoans([...loans, data[0]]);
    }
  };

  const updateLoan = async (id: string, returnDate: string) => {
    const { data, error } = await supabase
      .from('loans')
      .update({ return_date: returnDate })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating loan:', error);
    } else if (data) {
      setLoans(loans.map(loan => loan.id === id ? data[0] : loan));
    }
  };

  return { loans, loading, addLoan, updateLoan };
};