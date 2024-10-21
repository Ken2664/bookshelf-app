'use client'



import React, { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { Tag } from '@/types'

import { supabase } from '@/lib/supabase'

import { useAuth } from '@/hooks/useAuth'

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react'



interface TagInputProps {

  selectedTags: Tag[]

  setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>

}



const TagInput: React.FC<TagInputProps> = ({ selectedTags, setSelectedTags }) => {

  const [allTags, setAllTags] = useState<Tag[]>([])

  const [newTag, setNewTag] = useState<string>('')

  const [searchQuery, setSearchQuery] = useState<string>('')

  const [visibleTags, setVisibleTags] = useState<Tag[]>([])

  const [showAllTags, setShowAllTags] = useState<boolean>(false)

  const { user } = useAuth()



  const TAGS_PER_PAGE = 20



  const addTag = async (tagName: string) => {

    if (!user) return

    const { data, error } = await supabase

      .from('tags')

      .insert({ name: tagName, user_id: user.id })

      .select()

      .single()



    if (error) {

      console.error('Error adding tag:', error)

      return

    }

    return data

  }

  useEffect(() => {

    const fetchTags = async () => {

      if (!user) return

      const { data, error } = await supabase

        .from('tags')

        .select('*')

        .eq('user_id', user.id)



      if (error) {

        console.error('タグの取得中にエラーが発生しました:', error)

      } else if (data) {

        setAllTags(data)

      }

    }

    fetchTags()

  }, [user])



  useEffect(() => {

    const filteredTags = allTags.filter(tag =>

      tag.name.toLowerCase().includes(searchQuery.toLowerCase())

    )

    setVisibleTags(showAllTags ? filteredTags : filteredTags.slice(0, TAGS_PER_PAGE))

  }, [allTags, searchQuery, showAllTags])



  const handleAddTag = async (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    if (newTag.trim() === '') return

    const createdTag = await addTag(newTag)

    if (createdTag) {

      setAllTags([...allTags, createdTag])

      setNewTag('')

    }

  }



  const handleTagClick = (tag: Tag, event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    // タグの選択ロジックをここに追加

    if (!selectedTags.includes(tag)) {

      setSelectedTags([...selectedTags, tag]);

    } else {

      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));

    }

  };



  return (

    <div className="space-y-4">

      <div className="flex items-center space-x-2">

        <Input

          type="text"

          value={newTag}

          onChange={(e) => setNewTag(e.target.value)}

          placeholder="新しいタグを追加"

        />

        <Button onClick={handleAddTag} size="icon">

          <Plus className="h-4 w-4" />

        </Button>

      </div>

      <div className="relative">

        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

        <Input

          type="text"

          value={searchQuery}

          onChange={(e) => setSearchQuery(e.target.value)}

          placeholder="タグを検索"

          className="pl-10"

        />

      </div>

      <ScrollArea className="h-40">

        <AnimatePresence>

          {visibleTags.map(tag => (

            <motion.button
              key={tag.id}
              onClick={(event) => handleTagClick(tag, event)}
              className={`m-1 px-3 py-1 rounded-full ${
                selectedTags.find(t => t.id === tag.id)
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag.name}
            </motion.button>

          ))}

        </AnimatePresence>

      </ScrollArea>

      {!showAllTags && allTags.length > TAGS_PER_PAGE && (

        <Button

          onClick={() => setShowAllTags(true)}

          variant="link"

          className="w-full"

        >

          もっと見る

          <ChevronDown className="ml-2 h-4 w-4" />

        </Button>

      )}

      {showAllTags && (

        <Button

          onClick={() => setShowAllTags(false)}

          variant="link"

          className="w-full"

        >

          閉じる

          <ChevronUp className="ml-2 h-4 w-4" />

        </Button>

      )}

    </div>

  )

}



export default TagInput


