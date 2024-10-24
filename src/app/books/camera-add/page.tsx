'use client'

import React, { useState, useEffect } from 'react'
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
import { Loader2, Upload, Save } from 'lucide-react'
import imageCompression from 'browser-image-compression'

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

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // 最大サイズを1MBに設定
    maxWidthOrHeight: 1024, // 最大幅または高さを1024pxに制限
    useWebWorker: true,
  }
  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    throw new Error('画像の圧縮に失敗しました。')
  }
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
  const [isMobile, setIsMobile] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
      if (isMobileDevice) {
        console.log('モバイルデバイスが検出されました。')
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCapture = async (imageBase64: string) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const blob = dataURItoBlob(imageBase64)
      // ファイルサイズをチェック
      if (blob.size > 5 * 1024 * 1024) { // 5MB制限
        throw new Error('画像サイズが大きすぎます。5MB以下の画像を使用してください。')
      }

      const formData = new FormData()
      formData.append('image', blob, 'image.jpg')

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        // タイムアウト設定を追加
        timeout: 30000, // 30秒
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
      if (error instanceof Error) {
        setErrorMessage(`エラー: ${error.message}`)
      } else {
        setErrorMessage('画像のアップロードに失敗しました。もう一度お試しください。')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setLoading(true)
        // 画像を圧縮
        const compressedFile = await compressImage(file)
        
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setPreviewImage(base64String)
          handleCapture(base64String)
        }
        reader.onerror = (error) => {
          console.error('画像の読み込みに失敗しました:', error)
          setErrorMessage('画像の読み込みに失敗しました。もう一度お試しください。')
          setLoading(false)
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error('画像の処理に失敗しました:', error)
        setErrorMessage('画像の処理に失敗しました。もう一度お試しください。')
        setLoading(false)
      }
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
            <CardTitle className="text-2xl font-custom text-brown-800">画像アップロードで本を追加</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="text-red-500 mb-4 whitespace-pre-wrap">
                {errorMessage}
              </div>
            )}
            {!captureMethod && (
              <div className="flex space-x-4 mb-4">
                <Button onClick={() => setCaptureMethod('upload')} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                   画像をアップロード
                </Button>
              </div>
            )}

            {captureMethod === 'camera' && isMobile && <CameraCapture onCapture={handleCapture} />}

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
