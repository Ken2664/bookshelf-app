'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { Book } from '@/types'
import AuthGuard from '@/components/AuthGuard'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, User, Building2, Star } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

      if (error) {
        setError(error.message)
      } else {
        setBook(data)
      }
      setLoading(false)
    }

    fetchBook()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <Alert variant="destructive">
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>
          本の詳細を取得できませんでした: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-custom text-brown-800">{book.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex items-center text-gray-600">
              <User className="mr-2 h-4 w-4" />
              著者: {book.author}
            </p>
            <p className="flex items-center text-gray-600">
              <Building2 className="mr-2 h-4 w-4" />
              出版社: {book.publisher}
            </p>
            <div className="flex items-center text-yellow-500">
              <Star className="mr-2 h-4 w-4" />
              評価: {book.rating ? '★'.repeat(book.rating) : '未評価'}
            </div>
            {book.comment && (
              <p className="text-gray-700">{book.comment}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}