'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/hooks/useAuth'
import { Tag, Book } from '@/types'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import RatingStars from './RatingStars'
import TagInput from './TagInput'

type BookFormData = Omit<Book, 'id' | 'user_id' | 'status' | 'favorite' | 'book_tags' | 'created_at' | 'updated_at' | 'cover_image'> & {
  cover_image?: string
}

const BookForm: React.FC = () => {
  const { addBook } = useBooks()
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    publisher: '',
    rating: 0,
    comment: '',
  })
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)
      
      try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('image', file)

        const response = await axios.post('/api/upload-and-process', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const { bookInfo, coverUrl } = response.data
        setFormData(prev => ({
          ...prev,
          title: bookInfo.title || prev.title,
          author: bookInfo.author || prev.author,
          publisher: bookInfo.publisher || prev.publisher,
        }))
        setCoverImageUrl(coverUrl)
      } catch (error) {
        console.error('画像処理エラー:', error)
        setError('本の情報の自動取得に失敗しました。手動で入力してください。')
      } finally {
        setIsLoading(false)
      }
    }
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
      const bookData = {
        ...formData,
        user_id: user.id,
        status: 'unread' as const,
        favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (coverImageUrl) {
        bookData.cover_image = coverImageUrl
      }

      const newBook = await addBook(bookData, selectedTags)

      if (newBook) {
        setFormData({
          title: '',
          author: '',
          publisher: '',
          rating: 0,
          comment: '',
        })
        setSelectedTags([])
        setCoverImage(null)
        setCoverImageUrl('')

        router.push('/books')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("予期せぬエラーが発生しました。もう一度お試しください。")
      }
      console.error("本の追加中にエラーが発生しました:", error)
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brown-800">新しい本を追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">著者</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">出版社</Label>
              <Input
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">評価</Label>
              <RatingStars
                rating={formData.rating}
                setRating={(newRating) => setFormData(prev => ({ ...prev, rating: newRating }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">コメント</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <TagInput
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />

            <div className="space-y-2">
              <Label htmlFor="cover">表紙画像</Label>
              <Input
                id="cover"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {coverImageUrl && (
                <img src={coverImageUrl} alt="Book cover" className="mt-2 max-w-xs rounded shadow" />
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? '処理中...' : '本を追加'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default BookForm