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

      // 検索パラメータのログ追加
      console.log('検索パラメータ:', {
        searchType,
        searchTerm,
        userId: user.id
      })

      if (!searchType || !searchTerm) {
        setError('検索パラメータが不明です')
        setLoading(false)
        return
      }

      try {
        const decodedSearchTerm = decodeURIComponent(searchTerm)
        console.log('デコード後の検索語:', decodedSearchTerm)  // デコード結果のログ
        
        let query = supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)

        switch (searchType) {
          case 'content':
            query = query.ilike('content', `%${decodedSearchTerm}%`)
            console.log('セリフで検索:', `content ILIKE %${decodedSearchTerm}%`)
            break
          case 'author':
            query = query.ilike('author', `%${decodedSearchTerm}%`)
            console.log('著者で検索:', `author ILIKE %${decodedSearchTerm}%`)
            break
          case 'book_title':
            query = query.ilike('book_title', `%${decodedSearchTerm}%`)
            console.log('本のタイトルで検索:', `book_title ILIKE %${decodedSearchTerm}%`)
            break
          default:
            console.error('不正な検索タイプ:', searchType)
            throw new Error('不正な検索タイプです')
        }

        const { data, error: quotesError } = await query
        
        if (quotesError) {
          console.error('Supabaseエラー:', quotesError)  // Supabaseエラーのログ
          throw quotesError
        }

        // 検索結果の詳細ログ
        console.log('検索結果:', {
          件数: data?.length || 0,
          結果: data
        })
        
        setQuotes(data || [])
      } catch (err) {
        console.error('検索エラー詳細:', err)  // エラー詳細のログ
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
