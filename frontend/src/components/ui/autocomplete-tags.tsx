"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutocompleteTagsProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  maxTags?: number;
  variant?: "skills" | "interests";
}

export function AutocompleteTags({
  value,
  onChange,
  suggestions,
  placeholder = "Type to search...",
  className,
  maxTags,
  variant = "skills",
}: AutocompleteTagsProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      if (!maxTags || value.length < maxTags) {
        onChange([...value, trimmedTag]);
      }
    }
    setInputValue("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        addTag(filteredSuggestions[selectedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const handleAddCustom = () => {
    if (inputValue.trim()) {
      addTag(inputValue.trim());
      inputRef.current?.focus();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getVariantColors = () => {
    switch (variant) {
      case "skills":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "interests":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="min-h-[40px] border border-input rounded-md p-2 bg-background focus-within:ring-2 focus-within:ring-ring">
        <div className="flex flex-wrap gap-1 mb-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn("text-xs", getVariantColors())}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setIsOpen(true)}
            placeholder={
              maxTags && value.length >= maxTags
                ? `Maximum ${maxTags} ${variant} reached`
                : placeholder
            }
            disabled={!!(maxTags && value.length >= maxTags)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
          />
        </div>
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={cn(
                "px-3 py-2 cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground",
                selectedIndex === index && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}

          {inputValue.trim() &&
            !filteredSuggestions.includes(inputValue.trim()) && (
              <div className="border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm font-normal rounded-none"
                  onClick={handleAddCustom}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add "{inputValue.trim()}"
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
