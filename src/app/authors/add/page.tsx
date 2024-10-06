"use client";

import AuthGuard from '@/components/AuthGuard';
import FavoriteAuthors from '@/components/FavoriteAuthors';

export default function AddFavoriteAuthorsPage() {
  return (
    <AuthGuard>
      <div className="p-6">
        <FavoriteAuthors />
      </div>
    </AuthGuard>
  );
}