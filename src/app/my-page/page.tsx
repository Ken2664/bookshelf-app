'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useBooks } from '@/hooks/useBooks'
import { useUserProfile } from '@/hooks/useUserProfile'
import AuthGuard from '@/components/AuthGuard'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User, Book, BookOpen, CheckCircle } from 'lucide-react'

const MyPage: React.FC = () => {
  const { user } = useAuth()
  const { books } = useBooks()
  const { profile, loading, error } = useUserProfile()

  if (!user) return null

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen"
      >
        <h1 className="text-3xl font-custom text-brown-800 mb-6">マイページ</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-custom text-brown-800">ユーザー情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>メールアドレス:</strong> {user.email}</p>
                <p>
                  <strong>ユーザーネーム:</strong> 
                  {loading ? (
                    <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-brown-600" />
                  ) : (
                    profile?.username || '未設定'
                  )}
                </p>
                {error && <p className="text-red-500">ユーザー情報の取得に失敗しました</p>}
                <p><strong>登録した本の総数:</strong> {books.length}</p>
                <Button asChild variant="outline">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    プロフィールを編集
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-custom text-brown-800">読書の記録</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <strong>読了した本:</strong> {books.filter(book => book.status === 'completed').length}
                </p>
                <p className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                  <strong>読書中の本:</strong> {books.filter(book => book.status === 'reading').length}
                </p>
                <p className="flex items-center">
                  <Book className="mr-2 h-4 w-4 text-gray-500" />
                  <strong>未読の本:</strong> {books.filter(book => book.status === 'unread').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AuthGuard>
  )
}

export default MyPage