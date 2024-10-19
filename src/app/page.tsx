'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brown-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 font-sans">
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-8 sm:mb-12 text-center text-brown-800"
        >
          Bookshelf App へようこそ
        </motion.h1>
        
        <div className="flex justify-center">
          <div className="max-w-4xl w-full space-y-8 sm:space-y-12">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-brown-700 leading-relaxed text-center"
            >
              あなたの個人図書館を、ここBookshelf Appで管理しましょう。
              本の世界への扉を開き、あなたの読書生活をより豊かにするツールをご用意しています。
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {[
                { title: "持っている本の管理", icon: "📚" },
                { title: "お気に入り作家の登録", icon: "✍️" },
                { title: "貸本の管理", icon: "🤝" },
                { title: "プロフィールの登録", icon: "👤" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="flex items-center p-4 bg-white rounded-lg shadow-md"
                >
                  <span className="text-3xl mr-4">{feature.icon}</span>
                  <span className="text-lg sm:text-xl text-brown-800">{feature.title}</span>
                </motion.div>
              ))}
            </div>
            
            {!user && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-10 sm:mt-16 text-center"
              >
                <Link href="/login" className="inline-block bg-gradient-to-r from-brown-600 to-brown-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold hover:from-brown-700 hover:to-brown-800 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  始めましょう
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brown-800 to-transparent opacity-20"></div>
    </div>
  )
}