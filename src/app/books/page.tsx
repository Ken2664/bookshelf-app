'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { useBooks } from '@/hooks/useBooks'
import BookCard from '@/components/BookCard'
import SearchBar from '@/components/SearchBar'
import { Book } from '@/types'
import { Button } from "@/components/ui/button"
import { PlusCircle, Camera } from 'lucide-react'

export default function BooksPage() {
  const { books, loading, searchResults, searchBooks } = useBooks()
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([])

  useEffect(() => {
    setDisplayedBooks(books.sort((a, b) => a.title.localeCompare(b.title)))
  }, [books])

  const handleDeleteBook = (id: string) => {
    setDisplayedBooks(prevBooks => prevBooks.filter(book => book.id !== id))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brown-800 mb-4 sm:mb-0">本の一覧</h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button asChild>
                <Link href="/books/add">
                  <PlusCircle className="mr-2 h-4 w-4" /> 本を追加
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/books/camera-add">
                  <Camera className="mr-2 h-4 w-4" /> 画像から追加
                </Link>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SearchBar />
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brown-600"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {displayedBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <BookCard book={book} onDelete={handleDeleteBook} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AuthGuard>
  )
}