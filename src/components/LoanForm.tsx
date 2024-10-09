import React, { useState, useEffect, useRef } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';

const LoanForm: React.FC = () => {
  const { addLoan } = useLoans();
  const { books } = useBooks();
  const { user } = useAuth();
  const [bookId, setBookId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [loanDate, setLoanDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
    setShowSuggestions(searchTerm !== '' && filtered.length > 0);
  }, [searchTerm, books]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await addLoan({
        book_id: bookId,
        borrower_name: borrowerName,
        loan_date: loanDate,
        return_date: null,
        user_id: user.id,
      });
      setBookId('');
      setBorrowerName('');
      setLoanDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative" ref={searchRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setBookId('');
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="本のタイトルを検索"
          className="w-full p-2 border rounded"
        />
        {showSuggestions && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
            {filteredBooks.map((book) => (
              <li
                key={book.id}
                onClick={() => {
                  setBookId(book.id);
                  setSearchTerm(book.title);
                  setShowSuggestions(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {book.title}
              </li>
            ))}
          </ul>
        )}
      </div>
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