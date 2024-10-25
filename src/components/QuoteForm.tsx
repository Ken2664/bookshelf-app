'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useQuotes } from '@/hooks/useQuotes'
import { useBooks } from '@/hooks/useBooks'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Quote } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const QuoteForm: React.FC = () => {
  const { addQuote } = useQuotes()
  const { books } = useBooks()
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    book_title: '',
    page_number: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // 本のサジェスト用の状態を追加
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBooks, setFilteredBooks] = useState(books)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 本の検索結果をフィルタリング
  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBooks(filtered)
    setShowSuggestions(searchTerm !== '' && filtered.length > 0)
  }, [searchTerm, books])

  // クリックアウトサイド処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'book_title') {
      setSearchTerm(value)
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("ユーザーが認証されていません")
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      const quoteData = {
        ...formData,
        book_title: formData.book_title,
        page_number: formData.page_number ? parseInt(formData.page_number) : null,
        user_id: user.id,
      }

      const newQuote = await addQuote(quoteData)

      if (newQuote) {
        setFormData({
          content: '',
          author: '',
          book_title: '',
          page_number: '',
        })
        setSearchTerm('')
        router.push('/quotes')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("予期せぬエラーが発生しました。もう一度お試しください。")
      }
      console.error("セリフの追加中にエラーが発生しました:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-custom text-brown-800">セリフを登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">セリフ</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={3}
                placeholder="印象に残ったセリフを入力してください"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">著者</Label>
              <Input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="著者名を入力してください"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book_title">本のタイトル</Label>
              <div className="relative" ref={searchRef}>
                <Input
                  type="text"
                  id="book_title"
                  name="book_title"
                  value={searchTerm}
                  onChange={handleChange}
                  onFocus={() => setShowSuggestions(true)}
                  required
                  placeholder="本のタイトルを入力してください"
                />
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full bg-white border rounded mt-1"
                    >
                      <ScrollArea className="h-60">
                        {filteredBooks.map((book) => (
                          <motion.div
                            key={book.id}
                            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                            onClick={() => {
                              setSearchTerm(book.title)
                              setFormData(prev => ({ ...prev, book_title: book.title }))
                              setShowSuggestions(false)
                            }}
                            className="p-2 cursor-pointer"
                          >
                            {book.title}
                          </motion.div>
                        ))}
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="page_number">ページ番号（任意）</Label>
              <Input
                type="number"
                id="page_number"
                name="page_number"
                value={formData.page_number}
                onChange={handleChange}
                placeholder="ページ番号を入力してください（任意）"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            <Quote className="mr-2 h-4 w-4" />
            {isLoading ? '登録中...' : 'セリフを登録'}
          </Button>
        </CardFooter>
      </Card>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  )
}

export default QuoteForm
