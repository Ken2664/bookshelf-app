import React, { useState, useEffect } from 'react';
import { Tag } from '../types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface TagInputProps {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ selectedTags, setSelectedTags }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleTags, setVisibleTags] = useState<Tag[]>([]);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const { user } = useAuth();

  const TAGS_PER_PAGE = 20;

  const addTag = async (tagName: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: tagName, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding tag:', error);
      return;
    }
    return data;
  };

  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('タグの取得中にエラーが発生しました:', error);
      } else if (data) {
        setAllTags(data);
      }
    };
    fetchTags();
  }, [user]);

  useEffect(() => {
    const filteredTags = allTags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setVisibleTags(showAllTags ? filteredTags : filteredTags.slice(0, TAGS_PER_PAGE));
  }, [allTags, searchQuery, showAllTags]);

  const handleAddTag = async () => {
    if (newTag.trim() === '') return;
    const createdTag = await addTag(newTag);
    if (createdTag) {
      setAllTags([...allTags, createdTag]);
      setNewTag('');
    }
  };

  const toggleTag = (tag: Tag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="新しいタグを追加"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          追加
        </button>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="タグを検索"
        className="w-full p-2 border rounded"
      />
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(tag => (
          <span
            key={tag.id}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              selectedTags.find(t => t.id === tag.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tag.name}
          </span>
        ))}
      </div>
      {!showAllTags && allTags.length > TAGS_PER_PAGE && (
        <button
          onClick={() => setShowAllTags(true)}
          className="mt-2 text-blue-500 hover:underline"
        >
          もっと見る
        </button>
      )}
    </div>
  );
};

export default TagInput;