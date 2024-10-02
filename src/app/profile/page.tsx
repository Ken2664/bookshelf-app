"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || '');
      setBio(user.user_metadata?.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: { username, bio }
    });

    if (error) {
      console.error('Error updating or inserting profile:', error);
    } else {
      router.push('/my-page');
    }
  };

  if (!user) return null;

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              ユーザーネーム
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
              自己紹介
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;