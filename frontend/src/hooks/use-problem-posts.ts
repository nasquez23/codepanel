import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CreateProblemPostRequest, 
  ProblemPost, 
  ProblemPostResponse 
} from "@/types/problem-post";
import {
  createProblemPost,
  getAllProblemPosts,
  getProblemPostById,
  getMyProblemPosts,
  deleteProblemPost
} from "@/services/problem-post-api";

// Query Keys
export const problemPostKeys = {
  all: ['problem-posts'] as const,
  lists: () => [...problemPostKeys.all, 'list'] as const,
  list: (page: number, size: number, sortBy?: string, sortDir?: string) => 
    [...problemPostKeys.lists(), { page, size, sortBy, sortDir }] as const,
  details: () => [...problemPostKeys.all, 'detail'] as const,
  detail: (id: string) => [...problemPostKeys.details(), id] as const,
  myPosts: () => [...problemPostKeys.all, 'my-posts'] as const,
  myPostsList: (page: number, size: number) => 
    [...problemPostKeys.myPosts(), { page, size }] as const,
};

// Hook for fetching all problem posts with pagination
export const useProblemPosts = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
) => {
  return useQuery({
    queryKey: problemPostKeys.list(page, size, sortBy, sortDir),
    queryFn: () => getAllProblemPosts(page, size, sortBy, sortDir),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

// Hook for fetching a single problem post
export const useProblemPost = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: problemPostKeys.detail(id),
    queryFn: () => getProblemPostById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching current user's problem posts (requires authentication)
export const useMyProblemPosts = (
  page: number = 0,
  size: number = 10,
  enabled: boolean = true,
  isAuthenticated: boolean = false
) => {
  return useQuery({
    queryKey: problemPostKeys.myPostsList(page, size),
    queryFn: () => getMyProblemPosts(page, size),
    enabled: enabled && isAuthenticated, // Only run if user is authenticated
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for creating a problem post
export const useCreateProblemPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProblemPostRequest) => createProblemPost(data),
    onSuccess: (newPost) => {
      // Invalidate and refetch problem posts lists
      queryClient.invalidateQueries({ queryKey: problemPostKeys.lists() });
      queryClient.invalidateQueries({ queryKey: problemPostKeys.myPosts() });
      
      // Optimistically add the new post to the cache
      queryClient.setQueryData(
        problemPostKeys.detail(newPost.id),
        newPost
      );
    },
    onError: (error) => {
      console.error("Error creating problem post:", error);
    },
  });
};

// Hook for deleting a problem post
export const useDeleteProblemPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProblemPost(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted post from all relevant queries
      queryClient.invalidateQueries({ queryKey: problemPostKeys.lists() });
      queryClient.invalidateQueries({ queryKey: problemPostKeys.myPosts() });
      
      // Remove the specific post from the cache
      queryClient.removeQueries({ queryKey: problemPostKeys.detail(deletedId) });
      
      // Optimistically update the lists by removing the deleted post
      queryClient.setQueriesData(
        { queryKey: problemPostKeys.lists() },
        (oldData: ProblemPostResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            content: oldData.content.filter(post => post.id !== deletedId),
            totalElements: oldData.totalElements - 1,
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error deleting problem post:", error);
    },
  });
};

// Hook for prefetching a problem post (useful for hover effects)
export const usePrefetchProblemPost = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: problemPostKeys.detail(id),
      queryFn: () => getProblemPostById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};
