import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssignments,
  getAssignment,
  getMyAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  getSubmission,
  reviewSubmission,
  getPendingReviews,
  searchAssignments,
} from "@/services/assignment-api";
import {
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  CreateSubmissionRequest,
  CreateReviewRequest,
} from "@/types/assignment";
import { DifficultyLevel, Category, Tag } from "@/types/tags-categories";
import { useAuth } from "./use-auth";

export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (filters: string) => [...assignmentKeys.lists(), filters] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (assignmentId: string, userId: string | undefined) => [...assignmentKeys.details(), assignmentId, userId] as const,
  myAssignments: () => [...assignmentKeys.all, "my-assignments"] as const,
  submissions: () => [...assignmentKeys.all, "submissions"] as const,
  submissionsList: (assignmentId: string) =>
    [...assignmentKeys.submissions(), "list", assignmentId] as const,
  submissionDetail: (id: string) =>
    [...assignmentKeys.submissions(), "detail", id] as const,
  mySubmissions: () =>
    [...assignmentKeys.submissions(), "my-submissions"] as const,
  pendingReviews: () =>
    [...assignmentKeys.submissions(), "pending-reviews"] as const,
  search: () => [...assignmentKeys.all, "search"] as const,
  searchList: (
    query?: string,
    language?: string,
    difficulty?: DifficultyLevel,
    category?: Category | null,
    tags?: Tag[],
    page?: number,
    size?: number,
    sortBy?: string,
    sortDir?: string
  ) =>
    [
      ...assignmentKeys.search(),
      {
        query,
        language,
        difficulty,
        category,
        tags,
        page,
        size,
        sortBy,
        sortDir,
      },
    ] as const,
};

export const useAssignments = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "dueDate",
  sortDir: string = "asc",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: assignmentKeys.list(`${page}-${size}-${sortBy}-${sortDir}`),
    queryFn: () => getAssignments(page, size, sortBy, sortDir),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled,
  });
};

export const useCreateAssignment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentRequest) => createAssignment(data),
    onSuccess: (newAssignment) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.myAssignments(),
      });
      queryClient.setQueryData(
        assignmentKeys.detail(newAssignment.id, user?.id),
        newAssignment
      );
    },
    onError: (error) => {
      console.error("Error creating assignment:", error);
    },
  });
};

export const useAssignment = (id: string, userId: string | undefined) => {
  console.log("useAssignment called with id:", id, "and userId:", userId);
  return useQuery({
    queryKey: assignmentKeys.detail(id, userId),
    queryFn: () => getAssignment(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useMyAssignments = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...assignmentKeys.myAssignments(), page, size],
    queryFn: () => getMyAssignments(page, size),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentRequest }) =>
      updateAssignment(id, data),
    onSuccess: (updatedAssignment) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.myAssignments(),
      });
      queryClient.setQueryData(
        assignmentKeys.detail(updatedAssignment.id, user?.id),
        updatedAssignment
      );
    },
    onError: (error) => {
      console.error("Error updating assignment:", error);
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.myAssignments(),
      });
      queryClient.removeQueries({ queryKey: assignmentKeys.detail(id, user?.id) });
    },
    onError: (error) => {
      console.error("Error deleting assignment:", error);
    },
  });
};

// Submission hooks
export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: string;
      data: CreateSubmissionRequest;
    }) => submitAssignment(assignmentId, data),
    onSuccess: (newSubmission) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(newSubmission.assignment.id, user?.id),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.mySubmissions(),
      });
    },
    onError: (error) => {
      console.error("Error submitting assignment:", error);
    },
  });
};

export const useSubmissionsForAssignment = (
  assignmentId: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: [...assignmentKeys.submissionsList(assignmentId), page, size],
    queryFn: () => getSubmissionsForAssignment(assignmentId, page, size),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useMySubmissions = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...assignmentKeys.mySubmissions(), page, size],
    queryFn: () => getMySubmissions(page, size),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useSubmission = (id: string) => {
  return useQuery({
    queryKey: assignmentKeys.submissionDetail(id),
    queryFn: () => getSubmission(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: CreateReviewRequest;
    }) => reviewSubmission(submissionId, data),
    retry: false,
    onSuccess: (reviewedSubmission) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.submissions() });
      queryClient.setQueryData(
        assignmentKeys.submissionDetail(reviewedSubmission.id),
        reviewedSubmission
      );
    },
    onError: (error) => {
      console.error("Error reviewing submission:", error);
    },
  });
};

export const usePendingReviews = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...assignmentKeys.pendingReviews(), page, size],
    queryFn: () => getPendingReviews(page, size),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useSearchAssignments = (
  query?: string,
  language?: string,
  difficulty?: DifficultyLevel,
  category?: Category | null,
  tags?: Tag[],
  page: number = 0,
  size: number = 10,
  sortBy: string = "dueDate",
  sortDir: string = "asc",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: assignmentKeys.searchList(
      query,
      language,
      difficulty,
      category,
      tags,
      page,
      size,
      sortBy,
      sortDir
    ),
    queryFn: () =>
      searchAssignments(
        query,
        language,
        difficulty,
        category,
        tags,
        page,
        size,
        sortBy,
        sortDir
      ),
    enabled:
      enabled &&
      !!(query?.trim() || language || difficulty || category || tags),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
