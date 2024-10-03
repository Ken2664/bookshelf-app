import React, { useState, useEffect } from 'react';
import { Tag } from '../types';

interface TagInputProps {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ selectedTags, setSelectedTags }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>('');

  const addTag = async (tagName: string) => {
    // ここでタグを追加するロジックを実装
    // 例: Supabaseを使用してタグをデータベースに追加
    // 追加後、allTagsステートを更新
  };

  useEffect(() => {
    const fetchTags = async () => {
      // ここでタグを取得するロジックを実装
      // 例: const tags = await supabase.from('tags').select('*');
      // setAllTags(tags);
    };
    fetchTags();
  }, []);

  const handleAddTag = async () => {
    if (newTag.trim() === '') return;
    const createdTag = await addTag(newTag);
    if (createdTag !== undefined) {
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
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
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
    </div>
  );
};

export default TagInput;