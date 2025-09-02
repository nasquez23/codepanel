import { Category, DifficultyLevel, Tag } from "@/types/tags-categories";
import { fetcher, poster, putter, deleter } from "./api";
import {
  Assignment,
  AssignmentResponse,
  AssignmentSubmission,
  SubmissionResponse,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  CreateSubmissionRequest,
  CreateReviewRequest,
} from "@/types/assignment";

export const getAssignments = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "dueDate",
  sortDir: string = "asc"
): Promise<AssignmentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });
  return fetcher<AssignmentResponse>(`/api/assignments?${params}`);
};

export const getAssignment = async (id: string): Promise<Assignment> => {
  return fetcher<Assignment>(`/api/assignments/${id}`);
};

export const getMyAssignments = async (
  page: number = 0,
  size: number = 10
): Promise<AssignmentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  return fetcher<AssignmentResponse>(`/api/assignments/my?${params}`);
};

export const createAssignment = async (
  data: CreateAssignmentRequest
): Promise<Assignment> => {
  const response = await poster<CreateAssignmentRequest, Assignment>(
    "/api/assignments",
    data
  );
  return response.data;
};

export const updateAssignment = async (
  id: string,
  data: UpdateAssignmentRequest
): Promise<Assignment> => {
  const response = await putter<UpdateAssignmentRequest, Assignment>(
    `/api/assignments/${id}`,
    data
  );
  return response.data;
};

export const deleteAssignment = async (id: string) => {
  return deleter<void>(`/api/assignments/${id}`);
};

export const submitAssignment = async (
  assignmentId: string,
  data: CreateSubmissionRequest
): Promise<AssignmentSubmission> => {
  const response = await poster<CreateSubmissionRequest, AssignmentSubmission>(
    `/api/assignments/${assignmentId}/submit`,
    data
  );
  return response.data;
};

export const getSubmissionsForAssignment = async (
  assignmentId: string,
  page: number = 0,
  size: number = 10
): Promise<SubmissionResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  return fetcher<SubmissionResponse>(
    `/api/assignments/${assignmentId}/submissions?${params}`
  );
};

export const getMySubmissions = async (
  page: number = 0,
  size: number = 10
): Promise<SubmissionResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  return fetcher<SubmissionResponse>(`/api/submissions/my?${params}`);
};

export const getSubmission = async (
  id: string
): Promise<AssignmentSubmission> => {
  return fetcher<AssignmentSubmission>(`/api/submissions/${id}`);
};

export const reviewSubmission = async (
  submissionId: string,
  data: CreateReviewRequest
): Promise<AssignmentSubmission> => {
  const response = await poster<CreateReviewRequest, AssignmentSubmission>(
    `/api/submissions/${submissionId}/review`,
    data
  );
  return response.data;
};

export const getPendingReviews = async (
  page: number = 0,
  size: number = 10
): Promise<SubmissionResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  return fetcher<SubmissionResponse>(
    `/api/submissions/pending-reviews?${params}`
  );
};

export const searchAssignments = async (
  query?: string,
  language?: string,
  difficulty?: DifficultyLevel,
  category?: Category | null,
  tags?: Tag[],
  page: number = 0,
  size: number = 10,
  sortBy: string = "dueDate",
  sortDir: string = "asc"
): Promise<AssignmentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });

  if (query && query.trim()) {
    params.append("query", query.trim());
  }

  if (language) {
    params.append("language", language);
  }

  if (difficulty) {
    params.append("difficulty", difficulty);
  }

  if (category) {
    params.append("categoryId", category.id);
  }

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      params.append("tagIds", tag.id);
    });
  }

  return fetcher<AssignmentResponse>(`/api/assignments/search?${params}`);
};
