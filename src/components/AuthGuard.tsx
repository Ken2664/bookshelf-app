'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-16 w-16 animate-spin text-brown-600" />
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}