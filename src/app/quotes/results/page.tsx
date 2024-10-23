'use client'

import React, { Suspense } from 'react'


const QuotesResultsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuotesResults />
    </Suspense>
  )
}

const QuotesResults: React.FC = () => {
  // 検索パラメータを使用するロジック
  return <div>結果を表示</div>
}

export default QuotesResultsPage
