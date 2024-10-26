import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { Quote } from '@/types'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BookOpen, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface QuoteCardProps {
  quote: Quote;
  onDelete: (id: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onDelete }) => {
  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchBookTitle = async () => {
      if (quote.book_id) {
        const { data, error } = await supabase
          .from('books')
          .select('title')
          .eq('id', quote.book_id)
          .single();

        if (error) {
          console.error('Error fetching book title:', error);
        } else if (data) {
          setBookTitle(data.title);
        }
      }
    };

    fetchBookTitle();
  }, [quote.book_id, supabase]);

  const handleDelete = async () => {
    if (window.confirm('この引用を削除してもよろしいですか？')) {
      await onDelete(quote.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            {quote.content && (
              <p className="text-lg font-bold text-black font-custom-yuzu flex-1 pr-4">
                &ldquo;{quote.content}&rdquo;
              </p>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-amber-50 text-brown-800 h-[45px] flex flex-col justify-center font-custom-yuzu">
          <div className="flex items-center justify-end w-full mt-5">
            {bookTitle && (
              <div className="flex items-center text-sm mr-4">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{bookTitle}</span>
              </div>
            )}
            <p className="text-sm">
              - {quote.author}
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default QuoteCard
