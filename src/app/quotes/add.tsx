import { NextPage } from 'next';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import QuoteForm from '../../components/QuoteForm';

import { useAuth } from '../../hooks/useAuth'; // カスタムフックを使用

import AuthGuard from '@/components/AuthGuard'; // AuthGuardをインポート



const AddQuotePage: NextPage = () => {

  const router = useRouter();

  const { user, loading } = useAuth();

  const [pageError, setPageError] = useState<string | null>(null);



  const handleQuoteAdded = () => {

    router.push('/quotes');

  };



  const handleError = (error: string) => {

    setPageError(error);

    // エラーに応じて適切な処理を行う（例：ログアウトしてログインページにリダイレクトするなど）

  };



  if (loading) {

    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;

  }



  if (!user) {

    return null; // または適切なリダイレクト処理

  }



  return (

    <AuthGuard>

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold mb-6">セリフを追加</h1>

        {pageError && (

          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">

            <strong className="font-bold">エラー: </strong>

            <span className="block sm:inline">{pageError}</span>

          </div>

        )}

        <QuoteForm />

      </div>

    </AuthGuard>

  );

};



export default AddQuotePage;



