'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLoans } from '@/hooks/useLoans'
import { useBooks } from '@/hooks/useBooks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, User, Calendar, CheckCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"

const LoanList: React.FC = () => {
  const { loans, loading, updateLoan } = useLoans()
  const { books } = useBooks()
  const [searchTerm, setSearchTerm] = useState('')

  const handleReturn = async (id: string) => {
    const returnDate = new Date().toISOString().split('T')[0]
    await updateLoan(id, returnDate)
  }

  const filteredLoans = loans.filter(loan => {
    const book = books.find(b => b.id === loan.book_id)
    return book?.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brown-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="mb-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="作品名で検索"
        />
      </div>
      {filteredLoans.map((loan, index) => {
        const book = books.find((b) => b.id === loan.book_id)
        return (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-custom-yuzu text-brown-800 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {book?.title || '不明な本'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600">
                    <User className="mr-2 h-4 w-4" />
                    借りた人: {loan.borrower_name}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    貸出日: {loan.loan_date}
                  </p>
                  {loan.return_date ? (
                    <p className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      返却日: {loan.return_date}
                    </p>
                  ) : (
                    <Button
                      onClick={() => handleReturn(loan.id)}
                      className="mt-2"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      返却
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default LoanList
