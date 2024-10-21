'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import CameraCapture from '@/components/CameraCapture'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/hooks/useAuth'
import { Book, BookStatus, Tag } from '@/types'
import RatingStars from '@/components/RatingStars'
import BookStatusSelect from '@/components/BookStatusSelect'
import TagInput from '@/components/TagInput'
import Image from 'next/image'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Camera, Upload, Save } from 'lucide-react'

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export default function CameraAddBookPage() {
  const [bookInfo, setBookInfo] = useState<Partial<Book>>({
    title: '',
    author: '',
    publisher: '',
    rating: 0,
    status: 'unread' as BookStatus,
    comment: '',
    cover_image: '',
  })
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const { addBook } = useBooks()
  const router = useRouter()
  const [captureMethod, setCaptureMethod] = useState<'camera' | 'upload' | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { user } = useAuth()

  const handleCapture = async (imageBase64: string) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', dataURItoBlob(imageBase64), 'image.jpg')

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const { bookInfo: recognizedInfo, coverUrl } = response.data
      setBookInfo(prevInfo => ({
        ...prevInfo,
        title: recognizedInfo.title || '',
        author: recognizedInfo.author || '',
        publisher: recognizedInfo.publisher || '',
        cover_image: coverUrl,
      }))
      setPreviewImage(coverUrl)
    } catch (error) {
      console.error('本の認識に失敗しました:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
        alert(`本の認識に失敗しました: ${error.response?.data?.error || error.message}`)
      } else if (error instanceof Error) {
        alert(`本の認識に失敗しました: ${error.message}`)
      } else {
        alert('本の認識に失敗しました。もう一度お試しください。')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
        handleCapture(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookInfo(prevInfo => ({ ...prevInfo, [name]: value }))
  }

  const handleRatingChange = (newRating: number) => {
    setBookInfo(prevInfo => ({ ...prevInfo, rating: newRating }))
  }

  const handleStatusChange = (newStatus: BookStatus) => {
    setBookInfo(prevInfo => ({ ...prevInfo, status: newStatus }))
  }

  const handleSave = async () => {
    if (!user) {
      alert('ユーザーが認証されていません。ログインしてください。')
      return
    }

    if (!bookInfo.title) {
      alert('タイトルは必須です。')
      return
    }

    try {
      const newBook: Omit<Book, 'id' | 'book_tags' | 'cover_image'> = {
        title: bookInfo.title,
        author: bookInfo.author || '',
        publisher: bookInfo.publisher || '',
        rating: bookInfo.rating || 0,
        status: bookInfo.status || 'unread',
        comment: bookInfo.comment || '',
        favorite: false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const addedBook = await addBook(newBook, selectedTags)
      if (addedBook) {
        console.log('本が正常に追加されました:', addedBook)
        router.push('/books')
      } else {
        throw new Error('本の追加に失敗しました')
      }
    } catch (error) {
      console.error('本の保存に失敗しました:', error)
      alert('本の保存に失敗しました。もう一度お試しください。')
    }
  }

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
            <CardTitle className="text-2xl font-serif text-brown-800">カメラまたは画像アップロードで本を追加</CardTitle>
          </CardHeader>
          <CardContent>
            {!captureMethod && (
              <div className="flex space-x-4 mb-4">
                <Button onClick={() => setCaptureMethod('camera')} variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  カメラを使用
                </Button>
                <Button onClick={() => setCaptureMethod('upload')} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  画像をアップロード
                </Button>
              </div>
            )}

            {captureMethod === 'camera' && <CameraCapture onCapture={handleCapture} />}

            {captureMethod === 'upload' && (
              <div className="mb-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mb-2"
                />
                {previewImage && (
                  <div className="mt-2">
                    <Image src={previewImage} alt="プレビュー" width={200} height={200} />
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>本の情報を認識中...</span>
              </div>
            )}

            {bookInfo.title && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4 space-y-4"
              >
                <h2 className="text-xl font-semibold mb-2">本の情報</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">タイトル</Label>
                    <Input
                      id="title"
                      name="title"
                      value={bookInfo.title}
                      onChange={handleInputChange}
                      placeholder="タイトル"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">著者</Label>
                    <Input
                      id="author"
                      name="author"
                      value={bookInfo.author}
                      onChange={handleInputChange}
                      placeholder="著者"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publisher">出版社</Label>
                    <Input
                      id="publisher"
                      name="publisher"
                      value={bookInfo.publisher}
                      onChange={handleInputChange}
                      placeholder="出版社"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>評価</Label>
                    <RatingStars rating={bookInfo.rating || 0} setRating={handleRatingChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>進捗状況</Label>
                    <BookStatusSelect 
                      status={bookInfo.status || 'unread'} 
                      onStatusChange={handleStatusChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">コメント</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      value={bookInfo.comment}
                      onChange={handleInputChange}
                      placeholder="コメント"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>タグ</Label>
                    <TagInput
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter>
            {bookInfo.title && (
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}