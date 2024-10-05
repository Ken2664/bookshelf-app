"use client";

import AuthGuard from '@/components/AuthGuard';
import BookForm from '@/components/BookForm';
import Link from 'next/link';

export default function AddBookPage() {
  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">本を追加</h1>
        <Link href="/books/add/camera" className="btn btn-primary mb-4">
          カメラで撮影して追加
        </Link>
        <BookForm />
      </div>
    </AuthGuard>
  );
}