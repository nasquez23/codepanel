import { ProgrammingLanguage } from "./problem-post";
import { PaginatedResponse, UserInfo } from "./shared";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  instructor: UserInfo;
  dueDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
  hasSubmitted: boolean;
  mySubmission?: AssignmentSubmission;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  language: ProgrammingLanguage;
  dueDate?: string;
  isActive?: boolean;
}

export interface UpdateAssignmentRequest {
  title: string;
  description: string;
  language: ProgrammingLanguage;
  dueDate?: string;
  isActive: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignment: Assignment;
  code: string;
  status: SubmissionStatus;
  grade?: number;
  student: UserInfo;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  review?: SubmissionReview;
}

export interface CreateSubmissionRequest {
  code: string;
}

export interface SubmissionReview {
  id: string;
  comment?: string;
  score: number;
  reviewer: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  comment?: string;
  score: number;
}

export enum SubmissionStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  REVIEWED = "REVIEWED",
}

export type AssignmentResponse = PaginatedResponse<Assignment>;

export type SubmissionResponse = PaginatedResponse<AssignmentSubmission>;
