"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/types/tags-categories";
import { useTags } from "@/hooks";
import { TagBadge } from "./tag-badge";
import { Button } from "./button";
import { Input } from "./input";
import { X, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  className?: string;
  placeholder?: string;
  maxTags?: number;
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  className,
  placeholder = "Search tags...",
  maxTags = 10,
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data: allTags = [], isLoading: loading } = useTags();

  // Filter tags based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTags(allTags);
    } else {
      const filtered = allTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, allTags]);

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);

    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const availableTags = filteredTags.filter(
    (tag) => !selectedTags.some((selected) => selected.id === tag.id)
  );

  return (
    <div className={cn("relative", className)}>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <div key={tag.id} className="relative group">
              <TagBadge tag={tag} size="sm" />
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2 h-2" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Loading tags...</div>
          ) : availableTags.length > 0 ? (
            <div className="p-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    handleTagToggle(tag);
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center gap-2"
                >
                  <TagBadge tag={tag} size="sm" variant="secondary" />
                  {tag.description && (
                    <span className="text-sm text-gray-500 truncate">
                      {tag.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500">
              {searchQuery
                ? `No tags found for "${searchQuery}"`
                : "No tags available"}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
