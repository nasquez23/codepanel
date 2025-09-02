import { PaginatedResponse, UserInfo } from "./shared";
import { Category, Tag, DifficultyLevel } from "./tags-categories";

export interface ProblemPost {
  id: string;
  title: string;
  description: string;
  code?: string;
  language: ProgrammingLanguage;
  difficultyLevel: DifficultyLevel;
  category?: Category;
  tags: Tag[];
  author: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProblemPostRequest {
  title: string;
  description: string;
  code?: string;
  language: ProgrammingLanguage;
  difficultyLevel: DifficultyLevel;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateProblemPostRequest {
  title: string;
  description: string;
  code?: string;
  language: ProgrammingLanguage;
  difficultyLevel: DifficultyLevel;
  categoryId?: string;
  tagIds?: string[];
}

export type ProblemPostResponse = PaginatedResponse<ProblemPost>;

export enum ProgrammingLanguage {
  JAVA = "JAVA",
  JAVASCRIPT = "JAVASCRIPT",
  PYTHON = "PYTHON",
  TYPESCRIPT = "TYPESCRIPT",
  C = "C",
  CPP = "CPP",
  CSHARP = "CSHARP",
  PHP = "PHP",
}

export const ProgrammingLanguageDisplayNames = {
  [ProgrammingLanguage.JAVA]: "Java",
  [ProgrammingLanguage.JAVASCRIPT]: "JavaScript",
  [ProgrammingLanguage.PYTHON]: "Python",
  [ProgrammingLanguage.TYPESCRIPT]: "TypeScript",
  [ProgrammingLanguage.C]: "C",
  [ProgrammingLanguage.CPP]: "C++",
  [ProgrammingLanguage.CSHARP]: "C#",
  [ProgrammingLanguage.PHP]: "PHP",
};
