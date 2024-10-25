'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Quote } from '@/types'
import QuoteList from '@/components/QuoteList'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const QuotesResultsPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!searchParams) return

      const ids = searchParams.get('ids')
      if (!ids) {
        setError('検索パラメータが見つかりません')
        setLoading(false)
        return
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('quotes')
          .select('*')
          .in('id', ids.split(','))

        if (supabaseError) throw supabaseError

        setQuotes(data || [])
      } catch (err) {
        console.error('Error fetching quotes:', err)
        setError('引用の取得中にエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [searchParams, supabase])

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
          <CardTitle className="text-2xl font-custom text-brown-800">検索結果</CardTitle>
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

export default QuotesResultsPage
