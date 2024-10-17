"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { href: '/authors/add', label: 'お気に入り作家' },
  { href: '/books', label: '本の管理' },
  { href: '/recommended-books', label: 'おすすめの本' },
  { href: '/my-page', label: 'マイページ' },
  { href: '/loans', label: '貸し借り管理' },
  { href: '/quotes', label: 'セリフ管理' },
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
      <nav className="flex items-center justify-between p-4 bg-blue-600">
        <Link href="/" className="text-white text-lg font-bold">Bookshelf App</Link>
        <Link href="/login" className="text-white">ログイン</Link>
      </nav>
    )
  }

  return (
    <nav className="bg-blue-600 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-lg font-bold">Bookshelf App</Link>
            <div className="hidden md:flex ml-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">
              ログアウト
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-7 h-7 transform scale-120">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <line x1="12" y1="6" x2="18" y2="6"/>
                <line x1="12" y1="10" x2="18" y2="10"/>
                <line x1="12" y1="14" x2="18" y2="14"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-blue-600/80 shadow-lg z-10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-right">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
                {link.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 block w-auto px-3 py-2 rounded-md text-base font-medium mt-1 ml-auto">
              ログアウト
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
