'use client'

import React, { useEffect, useState, useCallback, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '@/hooks/useBooks'
import BookCard from '@/components/BookCard'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { BookStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Filter } from 'lucide-react'

const SearchResultsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}

const SearchResults: React.FC = () => {
  const { searchResults, loading, searchBooks, deleteBook } = useBooks()
  const searchParams = useSearchParams()
  const title = searchParams?.get('title') || ''
  const author = searchParams?.get('author') || ''
  const authors = searchParams?.get('authors') || '' // 複数作家の OR 検索用
  const tagIds = useMemo(() => {
    return searchParams?.get('tags')?.split(',').filter(Boolean) || []
  }, [searchParams]);
  const { user, loading: authLoading } = useAuth()
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all')
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(() => {
    if (user && !authLoading && !hasSearched) {
      const tagObjects = tagIds.map(id => ({ id, name: '', user_id: user.id }))
      // authors パラメータが存在する場合は OR 検索を実行
      if (authors) {
        searchBooks('', authors, tagObjects)
      } else {
        searchBooks(title, author, tagObjects)
      }
      setHasSearched(true)
    }
  }, [user, authLoading, hasSearched, searchBooks, title, author, authors, tagIds])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleStatusFilterChange = (status: BookStatus | 'all') => {
    setStatusFilter(status)
  }

  const filteredAndSortedBooks = searchResults
    .filter(book => statusFilter === 'all' || book.status === statusFilter)
    .sort((a, b) => a.title.localeCompare(b.title))

  const renderSearchCriteria = () => {
    const criteria = []
    if (title) criteria.push(`タイトル: "${title}"`)
    if (author) criteria.push(`著者: "${author}"`)
    if (authors) {
      const authorList = authors.split('|')
      criteria.push(`お気に入り作家: ${authorList.join(' または ')}`)
    }
    if (tagIds.length > 0) {
      const tagNames = tagIds.map(id => {
        const tag = searchResults.find(book => book.book_tags?.some(bt => bt.tag.id === id))?.book_tags?.find(bt => bt.tag.id === id)?.tag.name
        return tag || id
      }).join(', ')
      criteria.push(`タグ: ${tagNames}`)
    }
    return criteria.length > 0 ? criteria.join(', ') : 'すべての本'
  }

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm('本当にこの本を削除しますか？')) {
      await deleteBook(bookId)
      performSearch()
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
      </div>
    )
  }

  if (!user) {
    return <div>ログインしてください。</div>
  }

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-brown-800">検索結果</CardTitle>
            <Button asChild variant="outline">
              <Link href="/books">
                <ArrowLeft className="mr-2 h-4 w-4" />
                一覧に戻る
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-amber-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 text-brown-800">検索条件:</h2>
              <p>{renderSearchCriteria()}</p>
            </div>

            <div className="mb-4 flex items-center">
              <Filter className="mr-2 h-4 w-4 text-brown-600" />
              <span className="mr-2">進捗状態でフィルタ:</span>
              <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as BookStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="unread">未読</SelectItem>
                  <SelectItem value="reading">読書中</SelectItem>
                  <SelectItem value="completed">読了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredAndSortedBooks.length === 0 ? (
              <p className="text-center text-gray-600">該当する本��見つかりませんでした。</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BookCard book={book} onDelete={() => handleDeleteBook(book.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Suspense>
  )
}

export default SearchResultsPage
