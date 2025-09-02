"use client";

import { useState } from "react";
import {
  DifficultyLevel,
  DIFFICULTY_LEVEL_LABELS,
} from "@/types/tags-categories";
import { DifficultyBadge } from "./difficulty-badge";
import { Button } from "./button";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DifficultySelectorProps {
  selectedDifficulty?: DifficultyLevel | null;
  onDifficultyChange: (difficulty: DifficultyLevel | null) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function DifficultySelector({
  selectedDifficulty,
  onDifficultyChange,
  className,
  placeholder = "Select difficulty...",
  required = false,
}: DifficultySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const difficultyLevels = Object.values(DifficultyLevel);

  const handleDifficultySelect = (difficulty: DifficultyLevel | null) => {
    onDifficultyChange(difficulty);
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
        {selectedDifficulty ? (
          <DifficultyBadge difficulty={selectedDifficulty} size="sm" />
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
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-1">
            {!required && (
              <button
                onClick={() => handleDifficultySelect(null)}
                className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-gray-500">No difficulty set</span>
                {!selectedDifficulty && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            )}

            {difficultyLevels.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleDifficultySelect(difficulty)}
                className="w-full text-left p-2 rounded hover:bg-gray-50 flex items-center justify-between"
              >
                <DifficultyBadge difficulty={difficulty} size="sm" />
                {selectedDifficulty === difficulty && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
