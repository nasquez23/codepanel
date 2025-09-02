"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ProgrammingLanguage,
  ProgrammingLanguageDisplayNames,
} from "@/types/problem-post";
import { DifficultyLevel, Tag, Category } from "@/types/tags-categories";
import { TagSelector } from "@/components/ui/tag-selector";
import { CategorySelector } from "@/components/ui/category-selector";
import { DifficultySelector } from "@/components/ui/difficulty-selector";

interface SearchFiltersProps {
  language?: string;
  onLanguageChange?: (language: string | undefined) => void;
  difficulty?: DifficultyLevel;
  onDifficultyChange?: (difficulty: DifficultyLevel | undefined) => void;
  category?: Category | null;
  onCategoryChange?: (category: Category | null) => void;
  tags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
  sortBy?: string;
  onSortByChange?: (sortBy: string) => void;
  sortDir?: string;
  onSortDirChange?: (sortDir: string) => void;
  sortOptions?: { value: string; label: string }[];
  className?: string;
}

const languageOptions = Object.values(ProgrammingLanguage).map((language) => ({
  value: language,
  label: ProgrammingLanguageDisplayNames[language],
}));

const defaultSortOptions = [
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title" },
  { value: "updatedAt", label: "Updated Date" },
];

export default function SearchFilters({
  language,
  onLanguageChange,
  difficulty,
  onDifficultyChange,
  category,
  onCategoryChange,
  tags = [],
  onTagsChange,
  sortBy = "createdAt",
  onSortByChange,
  sortDir = "desc",
  onSortDirChange,
  sortOptions = defaultSortOptions,
  className = "",
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (value: string) => {
    if (value === "all") {
      onLanguageChange?.(undefined);
    } else {
      onLanguageChange?.(value);
    }
  };

  const handleClearFilters = () => {
    onLanguageChange?.(undefined);
    onDifficultyChange?.(undefined);
    onCategoryChange?.(null);
    onTagsChange?.([]);
    onSortByChange?.("createdAt");
    onSortDirChange?.("desc");
  };

  const hasActiveFilters =
    language || 
    difficulty || 
    category || 
    (tags && tags.length > 0) ||
    sortBy !== "createdAt" || 
    sortDir !== "desc";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                !
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-auto p-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={language || "all"}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <DifficultySelector
                selectedDifficulty={difficulty || null}
                onDifficultyChange={(diff) => onDifficultyChange?.(diff || undefined)}
                placeholder="All difficulties"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <CategorySelector
                selectedCategory={category}
                onCategoryChange={(cat) => onCategoryChange?.(cat)}
                placeholder="All categories"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <TagSelector
                selectedTags={tags}
                onTagsChange={(selectedTags) => onTagsChange?.(selectedTags)}
                placeholder="All tags"
                maxTags={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Select value={sortDir} onValueChange={onSortDirChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
