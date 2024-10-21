'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useQuotes } from '@/hooks/useQuotes'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Quote } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const QuoteForm: React.FC = () => {
  const { addQuote } = useQuotes()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
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
          <CardTitle className="text-2xl font-serif text-brown-800">セリフを登録</CardTitle>
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
              <Input
                type="text"
                id="book_title"
                name="book_title"
                value={formData.book_title}
                onChange={handleChange}
                required
                placeholder="本のタイトルを入力してください"
              />
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