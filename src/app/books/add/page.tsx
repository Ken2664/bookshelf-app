'use client'

import React from 'react'
import { motion } from 'framer-motion'
import AuthGuard from '@/components/AuthGuard'
import BookForm from '@/components/BookForm'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddBookPage() {
  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-custom text-brown-800">本を追加</CardTitle>
          </CardHeader>
          <CardContent>
            <BookForm />
          </CardContent>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}