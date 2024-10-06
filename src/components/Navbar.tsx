"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { href: '/authors/add', label: 'お気に入り作家' },
  { href: '/books', label: '本の管理' },
  { href: '/my-page', label: 'マイページ' },
  { href: '/loans', label: '貸し借り管理' },
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
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-white text-lg font-bold">Bookshelf App</Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} flex-col md:flex-row md:items-center md:justify-end pb-4 md:pb-0 bg-blue-600/80 md:bg-transparent absolute top-full left-0 right-0 md:relative`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="block px-4 py-2 md:inline-block md:mt-0 text-white hover:bg-blue-700 md:hover:bg-transparent text-right pr-4">
            {link.label}
          </Link>
        ))}
        <div className="md:ml-auto">
          <div className="md:ml-auto flex justify-end mr-4">
            <button onClick={handleLogout} className="inline-block px-4 py-2 mt-2 md:mt-0 text-white bg-red-500 hover:bg-red-600 rounded">
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}