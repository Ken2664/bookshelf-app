"use client";

import React from 'react';
import LoanForm from '@/components/LoanForm';
import LoanList from '@/components/LoanList';
import AuthGuard from '@/components/AuthGuard';

const LoansPage: React.FC = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">貸し借り管理</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">新しい貸出を記録</h2>
            <LoanForm />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">貸出リスト</h2>
            <LoanList />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default LoansPage;