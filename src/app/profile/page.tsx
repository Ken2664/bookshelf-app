'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '../../lib/supabase'
import AuthGuard from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          console.log('Fetching user data...')
          const { data, error } = await supabase
            .from('users')
            .select('username, bio')
            .eq('user_id', user.id)
            .single()

          if (error) {
            if (error.code === 'PGRST116') {
              console.log('User not found in users table. Will create on submit.')
            } else {
              throw error
            }
          }

          if (data) {
            console.log('User data fetched:', data)
            setUsername(data.username || '')
            setBio(data.bio || '')
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast.error('ユーザー情報の取得に失敗しました')
        }
      }
    }

    fetchUserData()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!username.trim()) {
      toast.error('ユーザーネームを入力してください')
      return
    }

    setIsSubmitting(true)
    console.log('Submitting profile update...')

    try {
      console.log('Upserting user data...')
      const { data, error } = await supabase
        .from('users')
        .upsert({ 
          user_id: user.id, 
          username, 
          bio
        }, { 
          onConflict: 'user_id'
        })

      if (error) throw error
      console.log('User data upserted successfully')

      toast.success('プロフィールが更新されました')
      await router.push('/my-page')
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error instanceof Error) {
        if (error.message.includes('42501')) {
          toast.error('RLSポリシー違反: プロフィールの更新権限がありません。管理者に連絡してください。')
          console.error('RLS Policy Violation. Check your RLS policies and ensure the user has the correct permissions.')
        } else if (error.message.includes('23505')) {
          toast.error('このユーザーネームは既に使用されています。別のユーザーネームを選択してください。')
        } else {
          toast.error(`プロフィールの更新に失敗しました: ${error.message}`)
        }
      } else {
        toast.error('不明なエラーが発生しました')
      }
    } finally {
      setIsSubmitting(false)
      console.log('Profile update process completed')
    }
  }

  if (!user) return <div>ログインしてください</div>

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-custom text-brown-800">プロフィール編集</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">ユーザーネーム</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">自己紹介</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AuthGuard>
  )
}

export default ProfilePage