import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBooks } from '@/hooks/useBooks'
import { FavoriteAuthor } from '@/types'

export const useFavoriteAuthors = () => {
  const { user } = useAuth()
  const { favoriteAuthors, fetchFavoriteAuthors } = useBooks()
  const [authors, setAuthors] = useState<FavoriteAuthor[]>([])

  useEffect(() => {
    if (user) {
      fetchFavoriteAuthors()
    }
  }, [user, fetchFavoriteAuthors])

  useEffect(() => {
    setAuthors(favoriteAuthors)
  }, [favoriteAuthors])

  return { favoriteAuthors: authors }
}
