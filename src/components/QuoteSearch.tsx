'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Quote } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from 'lucide-react'

interface QuoteSearchProps {
  onSearchResults?: (results: Quote[]) => void
  onError: (error: string) => void
}

const QuoteSearch: React.FC<QuoteSearchProps> = ({ onError }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'content' | 'author' | 'book_title'>('content')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      onError('検索キーワードを入力してください')
      return
    }

    try {
      // URLエンコードを確実に行う
      const params = new URLSearchParams()
      params.set('type', searchType)
      params.set('term', encodeURIComponent(searchTerm.trim()))

      // Next.js 13のApp Routerに対応したルーティング
      router.push(`/quotes/results?${params.toString()}`)
    } catch (error) {
      console.error('Navigation error:', error)
      onError('検索処理中にエラーが発生しました')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-brown-800">セリフを検索</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="検索キーワード"
                className="flex-grow"
              />
              <Select 
                value={searchType} 
                onValueChange={(value) => setSearchType(value as 'content' | 'author' | 'book_title')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="検索タイプ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">セリフ</SelectItem>
                  <SelectItem value="author">著者</SelectItem>
                  <SelectItem value="book_title">本のタイトル</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              検索
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default QuoteSearch
