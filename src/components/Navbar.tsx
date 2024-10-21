'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Book, User, Heart, BookOpen, Quote, LogOut, Menu } from 'lucide-react'

const navLinks = [
  { href: '/authors/add', label: 'お気に入り作家', icon: Heart },
  { href: '/books', label: '本の管理', icon: Book },
  { href: '/recommended-books', label: 'おすすめの本', icon: BookOpen },
  { href: '/my-page', label: 'マイページ', icon: User },
  { href: '/loans', label: '貸し借り管理', icon: Book },
  { href: '/quotes', label: 'セリフ管理', icon: Quote },
]

function useRouteChange(callback: () => void) {
  const pathname = usePathname()

  useEffect(() => {
    callback()
  }, [pathname, callback])
}

export default function Navbar() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [router])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  useRouteChange(useCallback(() => {
    setIsMenuOpen(false)
  }, []))

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <nav className="bg-gradient-to-r from-amber-100 to-orange-100 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-brown-800 text-xl font-serif font-bold">Bookshelf App</Link>
            <Button asChild variant="ghost">
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-amber-100 to-orange-100 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-brown-800 text-xl font-serif font-bold">Bookshelf App</Link>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Button key={link.href} asChild variant="ghost" size="sm">
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-amber-50 shadow-lg z-10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Button key={link.href} asChild variant="ghost" className="w-full justify-start" size="sm">
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
            <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  )
}