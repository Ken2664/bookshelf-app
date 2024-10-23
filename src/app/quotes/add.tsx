'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import QuoteCard from '@/components/QuoteCard'
import { Quote } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from 'lucide-react'

const QuoteResultsPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchQuotes = async () => {
      // searchParamsがnullでないことを確認
      if (searchParams) {
        const ids = searchParams.get('ids')
        if (ids) {
          const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .in('id', ids.split(','))

          if (error) {
            console.error('Error fetching quotes:', error)
          } else {
            setQuotes(data || [])
          }
        }
      }
      setLoading(false)
    }

    fetchQuotes()
  }, [searchParams, supabase])

  const handleRedirect = () => {
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
      className="container mx-auto px-4 py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-custom text-brown-800">検索結果</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length > 0 ? (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <QuoteCard quote={quote} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">セリフが見つかりませんでした。</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleRedirect} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            セリフページに戻る
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default QuoteResultsPage
