"use client";

import AuthGuard from '@/components/AuthGuard';
import BookForm from '@/components/BookForm';

export default function AddBookPage() {
  return (
    <AuthGuard>
      <div className="p-6">
        <BookForm />
      </div>
    </AuthGuard>
  );
}