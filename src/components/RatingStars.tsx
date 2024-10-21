'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  setRating?: (rating: number) => void
  readOnly?: boolean
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, setRating, readOnly = false }) => {
  const handleClick = (value: number) => {
    if (!readOnly && setRating) {
      setRating(value)
    }
  }

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <motion.button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          whileHover={!readOnly ? { scale: 1.1 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
          className={`focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          aria-label={`${value} star${value !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-6 h-6 ${
              value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        </motion.button>
      ))}
    </div>
  )
}

export default RatingStars