import React, { useState } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { useBooks } from '@/hooks/useBooks';

const LoanForm: React.FC = () => {
  const { addLoan } = useLoans();
  const { books } = useBooks();
  const [bookId, setBookId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [loanDate, setLoanDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addLoan({
      book_id: bookId,
      borrower_name: borrowerName,
      loan_date: loanDate,
      return_date: null,
    });
    setBookId('');
    setBorrowerName('');
    setLoanDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">本を選択してください</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={borrowerName}
        onChange={(e) => setBorrowerName(e.target.value)}
        placeholder="借りた人の名前"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={loanDate}
        onChange={(e) => setLoanDate(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        貸出を記録
      </button>
    </form>
  );
};

export default LoanForm;