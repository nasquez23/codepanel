export interface ProblemPost {
  id: string;
  title: string;
  description: string;
  code?: string;
  language: ProgrammingLanguage;
  author: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateProblemPostRequest {
  title: string;
  description: string;
  code?: string;
  language: ProgrammingLanguage;
}

export interface UpdateProblemPostRequest {
  title: string;
  description: string;
  code?: string;
  language: ProgrammingLanguage;
}

export interface ProblemPostResponse {
  content: ProblemPost[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export enum ProgrammingLanguage {
  JAVA = "JAVA",
  JAVASCRIPT = "JAVASCRIPT", 
  PYTHON = "PYTHON",
  TYPESCRIPT = "TYPESCRIPT",
  C = "C",
  CPP = "CPP",
  CSHARP = "CSHARP",
  PHP = "PHP"
}

export const ProgrammingLanguageDisplayNames = {
  [ProgrammingLanguage.JAVA]: "Java",
  [ProgrammingLanguage.JAVASCRIPT]: "JavaScript",
  [ProgrammingLanguage.PYTHON]: "Python",
  [ProgrammingLanguage.TYPESCRIPT]: "TypeScript",
  [ProgrammingLanguage.C]: "C",
  [ProgrammingLanguage.CPP]: "C++",
  [ProgrammingLanguage.CSHARP]: "C#",
  [ProgrammingLanguage.PHP]: "PHP"
};
