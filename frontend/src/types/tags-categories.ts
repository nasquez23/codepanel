export interface Tag {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface TagResponse extends Tag {}
export interface CategoryResponse extends Category {}

export interface CreateTagRequest {
  name: string;
  description?: string;
  color: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color: string;
}

export interface TagStats {
  problemPosts: number;
  assignments: number;
  total: number;
}

export interface CategoryStats {
  problemPosts: number;
  assignments: number;
  total: number;
}

export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  EASY = "EASY", 
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  EXPERT = "EXPERT"
}

export const DIFFICULTY_LEVEL_LABELS: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: "Beginner",
  [DifficultyLevel.EASY]: "Easy",
  [DifficultyLevel.MEDIUM]: "Medium", 
  [DifficultyLevel.HARD]: "Hard",
  [DifficultyLevel.EXPERT]: "Expert"
};

export const DIFFICULTY_LEVEL_COLORS: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: "bg-gray-100 text-gray-800",
  [DifficultyLevel.EASY]: "bg-green-100 text-green-800",
  [DifficultyLevel.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [DifficultyLevel.HARD]: "bg-orange-100 text-orange-800",
  [DifficultyLevel.EXPERT]: "bg-red-100 text-red-800"
};

