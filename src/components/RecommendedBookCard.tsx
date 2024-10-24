'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, User, Building2 } from 'lucide-react'

interface RecommendedBookCardProps {
  title: string
  author: string
  publisher: string
  description: string
  thumbnail?: string
}

const RecommendedBookCard: React.FC<RecommendedBookCardProps> = ({ title, author, publisher, description, thumbnail }) => {
  const [imageError, setImageError] = useState(false)

  const highResolutionThumbnail = useMemo(() => {
    if (!thumbnail) return ''
    const url = new URL(thumbnail)
    url.searchParams.set('zoom', '3')  // より高解像度の画像を要求
    return url.toString()
  }, [thumbnail])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4] w-full">
            {highResolutionThumbnail && !imageError ? (
              <Image
                src={highResolutionThumbnail}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-amber-100 rounded-t-lg flex items-center justify-center">
                <Book className="w-16 h-16 text-amber-500" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-custom-yuzu text-brown-800 mb-2">{title}</CardTitle>
          <div className="space-y-2">
            <p className="text-gray-600 flex items-center">
              <User className="w-4 h-4 mr-2" />
              {author}
            </p>
            <p className="text-gray-600 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              {publisher}
            </p>
            {description && description !== "No description available" && (
              <p className="text-gray-700 text-sm line-clamp-3">
                あらすじ: {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RecommendedBookCard