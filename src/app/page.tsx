'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Book, Users, Search, Heart, BookOpen } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brown-600"></div>
      </div>
    )
  }

  const features = [
    { title: "本の表紙写真からの登録", icon: Book, description: "本の表紙をスキャンするだけで簡単に登録できます。" },
    { title: "柔軟な検索機能", icon: Search, description: "作品名、作家名、タグから素早く検索できます。" },
    { title: "お気に入り作家の管理", icon: Heart, description: "好きな作家の作品をまとめて閲覧できます。" },
    { title: "視覚的な貸本管理", icon: Users, description: "誰に、いつ、何の本を貸したかが一目でわかります。" },
    { title: "おすすめ本の紹介", icon: BookOpen, description: "あなたの好みに合わせた本をご紹介します。" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 font-sans overflow-hidden">
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-3xl sm:text-4xl md:text-5xl font-custom font-bold mb-8 sm:mb-12 text-center text-brown-800"
        >
          Bookshelf App へようこそ
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-brown-700 leading-relaxed text-center mb-12">
            あなたの個人図書館を、ここBookshelf Appで管理しましょう。
            本の世界への扉を開き、あなたの読書生活をより豊かにするツールをご用意しています。
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <feature.icon className="w-12 h-12 text-brown-600 mb-4" />
              <h3 className="text-xl font-semibold text-brown-800 mb-2 text-center">{feature.title}</h3>
              <p className="text-brown-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        
        
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center"
          >
            <Link href="/login" className="inline-block bg-gradient-to-r from-brown-600 to-brown-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold hover:from-brown-700 hover:to-brown-800 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              始めましょう
            </Link>
          </motion.div>
        )}
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brown-800 to-transparent"
      ></motion.div>
    </div>
  )
}