import React from 'react';
import { useLoans } from '@/hooks/useLoans';
import { useBooks } from '@/hooks/useBooks';

const LoanList: React.FC = () => {
  const { loans, loading, updateLoan } = useLoans();
  const { books } = useBooks();

  const handleReturn = async (id: string) => {
    const returnDate = new Date().toISOString().split('T')[0];
    await updateLoan(id, returnDate);
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="space-y-4">
      {loans.map((loan) => {
        const book = books.find((b) => b.id === loan.book_id);
        return (
          <div key={loan.id} className="p-4 border rounded">
            <h3 className="font-bold">{book?.title || '不明な本'}</h3>
            <p>借りた人: {loan.borrower_name}</p>
            <p>貸出日: {loan.loan_date}</p>
            {loan.return_date ? (
              <p>返却日: {loan.return_date}</p>
            ) : (
              <button
                onClick={() => handleReturn(loan.id)}
                className="mt-2 p-2 bg-green-500 text-white rounded"
              >
                返却
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LoanList;