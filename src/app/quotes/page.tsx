'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import QuoteForm from '@/components/QuoteForm'
import QuoteSearch from '@/components/QuoteSearch'
import QuoteCard from '@/components/QuoteCard'
import { Quote } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import AuthGuard from '@/components/AuthGuard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const QuotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [randomQuotes, setRandomQuotes] = useState<Quote[]>([])
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRandomQuotes = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)

        if (error) {
          handleError(error.message)
        } else if (data) {
          const shuffled = data.sort(() => 0.5 - Math.random())
          setRandomQuotes(shuffled.slice(0, 5))
        }
      }
    }

    fetchRandomQuotes()
  }, [user, supabase])


  const handleError = (error: string) => {
    setPageError(error)
  }

  const handleSearchResults = (results: Quote[]) => {
    const query = results.map((quote) => quote.id).join(',')
    router.push(`/quotes/results?ids=${query}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen"
      >
        <h1 className="text-3xl font-custom text-brown-800 mb-6">セリフ管理</h1>
        
        {pageError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{pageError}</AlertDescription>
          </Alert>
        )}
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="mb-4"
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              フォームを閉じる
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              セリフを追加
            </>
          )}
        </Button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <QuoteForm />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <QuoteSearch onSearchResults={handleSearchResults} onError={handleError} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-custom text-brown-800">今日のおすすめ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {randomQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}

export default QuotesPage
