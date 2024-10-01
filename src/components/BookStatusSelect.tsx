import React from 'react';
import { BookStatus } from '@/types';

interface BookStatusSelectProps {
  status: BookStatus;
  onStatusChange: (status: BookStatus) => void;
}

const BookStatusSelect: React.FC<BookStatusSelectProps> = ({ status, onStatusChange }) => {
  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as BookStatus)}
      className="p-2 border rounded"
    >
      <option value="unread">未読</option>
      <option value="reading">読書中</option>
      <option value="completed">読了</option>
    </select>
  );
};

export default BookStatusSelect;