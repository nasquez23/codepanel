import {
  DifficultyLevel,
  DIFFICULTY_LEVEL_LABELS,
  DIFFICULTY_LEVEL_COLORS,
} from "@/types/tags-categories";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function DifficultyBadge({
  difficulty,
  className,
  size = "md",
  onClick,
}: DifficultyBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium transition-colors border",
        DIFFICULTY_LEVEL_COLORS[difficulty],
        sizeClasses[size],
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onClick}
    >
      {DIFFICULTY_LEVEL_LABELS[difficulty]}
    </span>
  );
}
