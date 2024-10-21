'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from '@/types'
import QuoteCard from './QuoteCard'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface QuoteListProps {
  quotes: Quote[]
  onError: (error: string) => void
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, onError }) => {
  if (!quotes) {
    onError('引用が見つかりませんでした。')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {quotes.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>お知らせ</AlertTitle>
          <AlertDescription>
            まだ引用が登録されていません。新しい引用を追加してみましょう！
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <QuoteCard quote={quote} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default QuoteList