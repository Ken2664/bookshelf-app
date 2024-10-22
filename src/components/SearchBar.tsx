'use client'



import React, { useState } from 'react'

import { motion } from 'framer-motion'

import { useBooks } from '@/hooks/useBooks'

import { useRouter } from 'next/navigation'

import TagInput from './TagInput'

import { Tag } from '@/types'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import { Search, Loader2 } from 'lucide-react'
 // お気に入り作家を取得するフックをインポート



import { useFavoriteAuthors } from '../hooks/useFavoriteAuthors'

// FavoriteAuthor 型を定義
type FavoriteAuthor = {
  author_name: string;
  // 他の必要なプロパティがあればここに追加
};

const SearchBar: React.FC = () => {

  const [title, setTitle] = useState('')

  const [author, setAuthor] = useState('')

  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const { searchBooks, loading } = useBooks()

  const router = useRouter()

  const { favoriteAuthors } = useFavoriteAuthors() as { favoriteAuthors: FavoriteAuthor[] }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (title.trim() === '' && author.trim() === '' && selectedTags.length === 0) {

      return // 検索条件が空の場合は何もしない

    }

    await performSearch()

  }

  const performSearch = async () => {

    console.log('検索フォーム送信:', { title, author, tags: selectedTags })

    try {

      await searchBooks(title, author, selectedTags)

      const tagIds = selectedTags.map(tag => tag.id).join(',')

      router.push(`/search-results?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&tags=${tagIds}`)

    } catch (error) {

      console.error('検索中にエラーが発生しました:', error)

    }

  }

  const handleKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter') {

      e.preventDefault() // エンターキーのデフォルト動作を防ぐ

      handleSubmit(e as unknown as React.FormEvent)

    }

  }

  const handleFavoriteAuthorsSearch = async () => {
    if (favoriteAuthors.length === 0) return

    const authorNames = favoriteAuthors.map(author => author.author_name).join(',')
    await searchBooks('', authorNames, [])
    router.push(`/search-results?author=${encodeURIComponent(authorNames)}`)
  }

  return (

    <motion.div

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.5 }}

    >

      <Card className="w-full max-w-2xl mx-auto">

        <CardHeader>

          <CardTitle className="text-2xl font-custom text-brown-800">本を検索</CardTitle>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="title">タイトル</Label>

                <Input

                  id="title"

                  type="text"

                  value={title}

                  onChange={(e) => setTitle(e.target.value)}

                  placeholder="タイトルで検索"

                />

              </div>

              <div className="space-y-2">

                <Label htmlFor="author">著者名</Label>

                <Input

                  id="author"

                  type="text"

                  value={author}

                  onChange={(e) => setAuthor(e.target.value)}

                  placeholder="著者名で検索"

                />

              </div>

            </div>

            <div className="space-y-2">

              <Label>タグ</Label>

              <TagInput 

                selectedTags={selectedTags} 

                setSelectedTags={setSelectedTags}

              />

            </div>

          </form>

        </CardContent>

        <CardFooter className="flex space-x-4">

          <Button 

            onClick={handleSubmit}

            className="w-full"

            disabled={loading || (title.trim() === '' && author.trim() === '' && selectedTags.length === 0)}

          >

            {loading ? (

              <Loader2 className="mr-2 h-4 w-4 animate-spin" />

            ) : (

              <Search className="mr-2 h-4 w-4" />

            )}

            {loading ? '検索中...' : '検索'}

          </Button>

          <Button 

            onClick={handleFavoriteAuthorsSearch}

            className="w-full"

            disabled={loading || favoriteAuthors.length === 0}

          >

            お気に入り作家で検索

          </Button>

        </CardFooter>

      </Card>

    </motion.div>

  )

}



export default SearchBar
