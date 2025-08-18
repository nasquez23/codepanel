import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getCommentCount,
  getMyComments,
} from "@/services/comment-api";
import { CreateCommentRequest, UpdateCommentRequest } from "@/types/comment";

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (problemPostId: string) => [...commentKeys.lists(), problemPostId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  counts: () => [...commentKeys.all, "count"] as const,
  count: (problemPostId: string) => [...commentKeys.counts(), problemPostId] as const,
  myComments: () => [...commentKeys.all, "my-comments"] as const,
};

export const useComments = (
  problemPostId: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
) => {
  return useQuery({
    queryKey: [...commentKeys.list(problemPostId), page, size, sortBy, sortDir],
    queryFn: () => getComments(problemPostId, page, size, sortBy, sortDir),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useComment = (commentId: string, problemPostId: string) => {
  return useQuery({
    queryKey: commentKeys.detail(commentId),
    queryFn: () => getComment(commentId, problemPostId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ problemPostId, data }: { problemPostId: string; data: CreateCommentRequest }) =>
      createComment(problemPostId, data),
    onSuccess: (newComment, { problemPostId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(problemPostId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.count(problemPostId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
      queryClient.setQueryData(commentKeys.detail(newComment.id), newComment);
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      commentId,
      problemPostId,
      data,
    }: {
      commentId: string;
      problemPostId: string;
      data: UpdateCommentRequest;
    }) => updateComment(commentId, problemPostId, data),
    onSuccess: (updatedComment, { problemPostId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(problemPostId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, problemPostId }: { commentId: string; problemPostId: string }) =>
      deleteComment(commentId, problemPostId),
    onSuccess: (_, { problemPostId, commentId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(problemPostId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.count(problemPostId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
      queryClient.removeQueries({ queryKey: commentKeys.detail(commentId) });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, problemPostId }: { commentId: string; problemPostId: string }) =>
      likeComment(commentId, problemPostId),
    onSuccess: (updatedComment, { problemPostId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(problemPostId) });
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
    },
    onError: (error) => {
      console.error("Error liking comment:", error);
    },
  });
};

export const useDislikeComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, problemPostId }: { commentId: string; problemPostId: string }) =>
      dislikeComment(commentId, problemPostId),
    onSuccess: (updatedComment, { problemPostId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(problemPostId) });
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
    },
    onError: (error) => {
      console.error("Error disliking comment:", error);
    },
  });
};

export const useCommentCount = (problemPostId: string) => {
  return useQuery({
    queryKey: commentKeys.count(problemPostId),
    queryFn: () => getCommentCount(problemPostId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useMyComments = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
) => {
  return useQuery({
    queryKey: [...commentKeys.myComments(), page, size, sortBy, sortDir],
    queryFn: () => getMyComments(page, size, sortBy, sortDir),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
