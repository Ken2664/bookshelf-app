'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from 'lucide-react'

const FavoriteAuthors: React.FC = () => {
  const { user } = useAuth()
  const { favoriteAuthors, fetchFavoriteAuthors, addFavoriteAuthor, removeFavoriteAuthor } = useBooks()
  const [newAuthor, setNewAuthor] = useState<string>('')

  useEffect(() => {
    if (user) {
      fetchFavoriteAuthors()
    }
  }, [user, fetchFavoriteAuthors])

  const handleAdd = async () => {
    if (newAuthor.trim() === '') return
    await addFavoriteAuthor(newAuthor.trim())
    setNewAuthor('')
  }

  const handleRemove = async (id: string) => {
    await removeFavoriteAuthor(id)
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-custom text-brown-800">お気に入り作家</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="新しい作家を追加"
              className="flex-1"
            />
            <Button onClick={handleAdd} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {favoriteAuthors.map((author, index) => (
              <motion.li
                key={author.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between items-center bg-amber-50 p-2 rounded"
              >
                <span className="text-brown-800">{author.author_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(author.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FavoriteAuthors