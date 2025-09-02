"use client";

import { useState } from "react";
import { Category } from "@/types/tags-categories";
import { useCategories } from "@/hooks";
import { CategoryBadge } from "./category-badge";
import { Button } from "./button";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategory?: Category | null;
  onCategoryChange: (category: Category | null) => void;
  className?: string;
  placeholder?: string;
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
  className,
  placeholder = "Select category...",
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, isLoading } = useCategories();

  const handleCategorySelect = (category: Category | null) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        {selectedCategory ? (
          <CategoryBadge
            category={selectedCategory}
            size="sm"
            variant="secondary"
          />
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              Loading categories...
            </div>
          ) : (
            <div className="p-1">
              <button
                onClick={() => handleCategorySelect(null)}
                className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-gray-500">No category</span>
                {!selectedCategory && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CategoryBadge
                      category={category}
                      size="sm"
                      variant="secondary"
                    />
                    {category.description && (
                      <span className="text-sm text-gray-500 truncate">
                        {category.description}
                      </span>
                    )}
                  </div>
                  {selectedCategory?.id === category.id && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              ))}
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
