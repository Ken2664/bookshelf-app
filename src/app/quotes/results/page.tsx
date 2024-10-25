'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Quote } from '@/types'
import QuoteList from '@/components/QuoteList'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from '@/hooks/useAuth'

const QuotesResults: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!searchParams || !user) return

      const searchType = searchParams.get('type')
      const searchTerm = searchParams.get('term')

      if (!searchType || !searchTerm) {
        setError('検索パラメータが不正です')
        setLoading(false)
        return
      }

      try {
        let query = supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)

        if (searchType === 'book_title') {
          // まず本を検索
          const { data: books, error: bookError } = await supabase
            .from('books')
            .select('id')
            .ilike('title', `%${searchTerm}%`)
            .eq('user_id', user.id)

          if (bookError) throw bookError

          if (books && books.length > 0) {
            // 見つかった本のIDで引用を検索
            const bookIds = books.map(book => book.id)
            query = query.in('book_id', bookIds)
          } else {
            // 本が見つからない場合は空の結果を返す
            setQuotes([])
            setLoading(false)
            return
          }
        } else {
          // 本以外の検索の場合
          query = query.ilike(searchType, `%${searchTerm}%`)
        }

        const { data, error: quotesError } = await query

        if (quotesError) throw quotesError

        setQuotes(data || [])
      } catch (err) {
        console.error('Error fetching quotes:', err)
        setError('引用の検索中にエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [searchParams, supabase, user])

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleBack = () => {
    router.push('/quotes')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-custom text-brown-800">
            検索結果 ({quotes.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <QuoteList quotes={quotes} onError={handleError} />
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            セリフページに戻る
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const QuotesResultsPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
      </div>
    }>
      <QuotesResults />
    </Suspense>
  )
}

export default QuotesResultsPage
