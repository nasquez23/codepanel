import { ProgrammingLanguage } from "@/types/problem-post";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const languageMap: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.JAVASCRIPT]: "javascript",
  [ProgrammingLanguage.TYPESCRIPT]: "typescript",
  [ProgrammingLanguage.PYTHON]: "python",
  [ProgrammingLanguage.JAVA]: "java",
  [ProgrammingLanguage.C]: "c",
  [ProgrammingLanguage.CPP]: "cpp",
  [ProgrammingLanguage.CSHARP]: "csharp",
  [ProgrammingLanguage.PHP]: "php",
};
