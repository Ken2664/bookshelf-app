import React, { useState, useEffect } from 'react'
import { Book, BookStatus } from '@/types'
import { useBooks } from '@/hooks/useBooks'
import { motion } from 'framer-motion'
import { Heart, Trash2, Edit2, Save, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface BookCardProps {
  book: Book
  onDelete: (id: string) => void
}

const BookCard: React.FC<BookCardProps> = ({ book: initialBook, onDelete }) => {
  const { updateBook, updateBookStatus, deleteBook } = useBooks()
  const [book, setBook] = useState<Book>(initialBook)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(initialBook.rating)
  const [comment, setComment] = useState<string>(initialBook.comment)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setBook(initialBook)
    setRating(initialBook.rating)
    setComment(initialBook.comment)
    setIsLoading(false)
  }, [initialBook])

  const handleSave = async () => {
    const updatedBook = await updateBook(book.id, { rating, comment, favorite: book.favorite })
    if (updatedBook) {
      setBook(updatedBook)
      setIsEditing(false)
    }
  }

  const toggleFavorite = async () => {
    const newFavoriteStatus = !book.favorite
    const updatedBook = await updateBook(book.id, { favorite: newFavoriteStatus })
    if (updatedBook) {
      setBook(updatedBook)
    }
  }

  const handleStatusChange = async (newStatus: BookStatus) => {
    setBook(prevBook => ({ ...prevBook, status: newStatus }))
    const updatedBook = await updateBookStatus(book.id, newStatus)
    if (updatedBook) {
      setBook(updatedBook)
    } else {
      setBook(prevBook => ({ ...prevBook, status: book.status }))
    }
  }

  const handleDelete = async () => {
    if (window.confirm('本当にこの本を削除しますか？')) {
      await deleteBook(book.id)
      onDelete(book.id)
    }
  }

  const getStatusText = (status: BookStatus) => {
    switch (status) {
      case 'unread':
        return '読みたい';
      case 'reading':
        return '読書中';
      case 'completed':
        return '読了';
      default:
        return '不明';
    }
  };

  if (isLoading || !book) {
    return <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
    </div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
          <CardTitle className="flex justify-between items-start">
            <span className="text-xl font-serif text-brown-800">{book.title}</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Heart className={`h-5 w-5 ${book.favorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-600">著者: {book.author}</p>
          <p className="text-gray-600">出版社: {book.publisher}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {book.book_tags && book.book_tags.map((bookTag) => (
              <span key={bookTag.id} className="px-3 py-1 bg-amber-100 text-brown-700 rounded-full text-sm">
                {bookTag.tag?.name || 'Unknown Tag'}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-semibold text-brown-700">進捗状態: </span>
            <Select value={book.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue>{getStatusText(book.status)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unread">読みたい</SelectItem>
                <SelectItem value="reading">読書中</SelectItem>
                <SelectItem value="completed">読了</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isEditing ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <span className="mr-2 text-brown-700">評価:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => setRating(star)}
                    className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </Button>
                ))}
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="コメントを入力してください（最大100文字）"
                maxLength={100}
              />
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <span className="mr-2 text-brown-700">評価:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-2xl ${book.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{book.comment}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> 保存
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" /> キャンセル
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" /> 編集
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default BookCard
