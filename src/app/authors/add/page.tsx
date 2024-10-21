'use client'

import React from 'react'
import { motion } from 'framer-motion'
import AuthGuard from '@/components/AuthGuard'
import FavoriteAuthors from '@/components/FavoriteAuthors'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from 'lucide-react'

export default function AddFavoriteAuthorsPage() {
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
            <CardTitle className="text-3xl font-serif text-brown-800 flex items-center">
              <User className="mr-2 h-6 w-6" />
              お気に入りの著者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FavoriteAuthors />
          </CardContent>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}