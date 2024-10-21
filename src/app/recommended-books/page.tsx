'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import RecommendedBookCard from '@/components/RecommendedBookCard'
import AuthGuard from '@/components/AuthGuard'
import { fetchGoogleBooksInfo } from '@/lib/googleBooks'
import { RecommendedBook } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BookOpen } from 'lucide-react'

const RecommendedBooksPage: React.FC = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('recommended_books')
          .select('book_title, book_author, book_publisher')
          .eq('user_id', user.id)

        if (error) throw error

        if (data) {
          const booksWithDetails = await Promise.all(
            data.map(async (book) => {
              const googleBookInfo = await fetchGoogleBooksInfo(book.book_title, book.book_author)
              return {
                ...book,
                ...googleBookInfo
              }
            })
          )
          setRecommendedBooks(booksWithDetails)
        }
      } catch (error) {
        console.error('おすすめの本の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedBooks()
  }, [user])

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-brown-800 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              おすすめの本
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
              </div>
            ) : recommendedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedBooks.map((book, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <RecommendedBookCard
                      title={book.title ?? book.book_title ?? ''}
                      author={book.author ?? book.book_author ?? ''}
                      publisher={book.publisher ?? book.book_publisher ?? ''}
                      description={book.description ?? ''}
                      thumbnail={book.thumbnail ?? ''}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">おすすめの本がありません。</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}

export default RecommendedBooksPage