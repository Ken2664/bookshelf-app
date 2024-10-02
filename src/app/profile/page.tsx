"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          console.log('Fetching user data...');
          const { data, error } = await supabase
            .from('users')
            .select('username, bio')
            .eq('user_id', user.id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              console.log('User not found in users table. Will create on submit.');
            } else {
              throw error;
            }
          }

          if (data) {
            console.log('User data fetched:', data);
            setUsername(data.username || '');
            setBio(data.bio || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('ユーザー情報の取得に失敗しました');
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!username.trim()) {
      toast.error('ユーザーネームを入力してください');
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting profile update...');

    try {
      console.log('Upserting user data...');
      const { data, error } = await supabase
        .from('users')
        .upsert({ 
          user_id: user.id, 
          username, 
          bio
        }, { 
          onConflict: 'user_id'
        });

      if (error) throw error;
      console.log('User data upserted successfully');

      toast.success('プロフィールが更新されました');
      await router.push('/my-page');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof Error) {
        if (error.message.includes('42501')) {
          toast.error('RLSポリシー違反: プロフィールの更新権限がありません。管理者に連絡してください。');
          console.error('RLS Policy Violation. Check your RLS policies and ensure the user has the correct permissions.');
        } else if (error.message.includes('23505')) {
          toast.error('このユーザーネームは既に使用されています。別のユーザーネームを選択してください。');
        } else {
          toast.error(`プロフィールの更新に失敗しました: ${error.message}`);
        }
      } else {
        toast.error('不明なエラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
      console.log('Profile update process completed');
    }
  };

  if (!user) return <div>ログインしてください</div>;

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
              required
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
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;