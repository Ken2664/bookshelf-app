'use client'

import React from 'react'
import { BookStatus } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Book, BookOpen, CheckCircle } from 'lucide-react'

interface BookStatusSelectProps {
  status: BookStatus
  onStatusChange: (status: BookStatus) => void
}

const BookStatusSelect: React.FC<BookStatusSelectProps> = ({ status, onStatusChange }) => {
  return (
    <Select value={status} onValueChange={(value) => onStatusChange(value as BookStatus)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="本の状態を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unread">
          <div className="flex items-center">
            <Book className="mr-2 h-4 w-4" />
            未読
          </div>
        </SelectItem>
        <SelectItem value="reading">
          <div className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            読書中
          </div>
        </SelectItem>
        <SelectItem value="completed">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            読了
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export default BookStatusSelect