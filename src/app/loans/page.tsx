'use client'

import React from 'react'
import { motion } from 'framer-motion'
import LoanForm from '@/components/LoanForm'
import LoanList from '@/components/LoanList'
import AuthGuard from '@/components/AuthGuard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ListPlus } from 'lucide-react'

const LoansPage: React.FC = () => {
  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100"
      >
        <h1 className="text-3xl font-custom text-brown-800 mb-6 text-center">貸し借り管理</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-custom text-brown-800 flex items-center">
                  <ListPlus className="mr-2 h-6 w-6 text-amber-600" />
                  新しい貸出を記録
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LoanForm />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-custom text-brown-800 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-amber-600" />
                  貸出リスト
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LoanList />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AuthGuard>
  )
}

export default LoansPage