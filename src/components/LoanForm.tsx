'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLoans } from '@/hooks/useLoans'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Book } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const LoanForm: React.FC = () => {
  const { addLoan } = useLoans()
  const { books } = useBooks()
  const { user } = useAuth()
  const [bookId, setBookId] = useState('')
  const [borrowerName, setBorrowerName] = useState('')
  const [loanDate, setLoanDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBooks, setFilteredBooks] = useState(books)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBooks(filtered)
    setShowSuggestions(searchTerm !== '' && filtered.length > 0)
  }, [searchTerm, books])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user && bookId) {
      try {
        await addLoan({
          book_id: bookId,
          borrower_name: borrowerName,
          loan_date: loanDate,
          return_date: null,
          user_id: user.id,
        })
        setBookId('')
        setBorrowerName('')
        setLoanDate('')
        setSearchTerm('')
        setError(null)
        // ここに画面をリロードするコードを追加
        window.location.reload()
      } catch (error) {
        console.error('Error adding loan:', error)
        setError('貸出の記録中にエラーが発生しました。もう一度お試しください。')
      }
    } else {
      setError('本を選択してください。')
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
          <CardTitle className="text-2xl text-brown-800">貸出を記録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="book-search">本のタイトル</Label>
              <div className="relative" ref={searchRef}>
                <Input
                  id="book-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setBookId('')
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="本のタイトルを検索"
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
                              setBookId(book.id)
                              setSearchTerm(book.title)
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
              <Label htmlFor="borrower-name">借りた人の名前</Label>
              <Input
                id="borrower-name"
                type="text"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="借りた人の名前"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-date">貸出日</Label>
              <Input
                id="loan-date"
                type="date"
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={!bookId}
          >
            <Book className="mr-2 h-4 w-4" />
            貸出を記録
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

export default LoanForm
