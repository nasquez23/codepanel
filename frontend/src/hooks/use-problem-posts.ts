import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateProblemPostRequest,
  UpdateProblemPostRequest,
  ProblemPostResponse,
} from "@/types/problem-post";
import {
  createProblemPost,
  updateProblemPost,
  getAllProblemPosts,
  getProblemPostById,
  getMyProblemPosts,
  deleteProblemPost,
  searchProblemPosts,
} from "@/services/problem-post-api";

export const problemPostKeys = {
  all: ["problem-posts"] as const,
  lists: () => [...problemPostKeys.all, "list"] as const,
  list: (page: number, size: number, sortBy?: string, sortDir?: string) =>
    [...problemPostKeys.lists(), { page, size, sortBy, sortDir }] as const,
  details: () => [...problemPostKeys.all, "detail"] as const,
  detail: (id: string) => [...problemPostKeys.details(), id] as const,
  myPosts: () => [...problemPostKeys.all, "my-posts"] as const,
  myPostsList: (page: number, size: number) =>
    [...problemPostKeys.myPosts(), { page, size }] as const,
  search: () => [...problemPostKeys.all, "search"] as const,
  searchList: (query?: string, language?: string, page?: number, size?: number, sortBy?: string, sortDir?: string) =>
    [...problemPostKeys.search(), { query, language, page, size, sortBy, sortDir }] as const,
};

export const useProblemPosts = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
) => {
  return useQuery({
    queryKey: problemPostKeys.list(page, size, sortBy, sortDir),
    queryFn: () => getAllProblemPosts(page, size, sortBy, sortDir),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProblemPost = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: problemPostKeys.detail(id),
    queryFn: () => getProblemPostById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMyProblemPosts = (
  page: number = 0,
  size: number = 10,
  enabled: boolean = true,
  isAuthenticated: boolean = false
) => {
  return useQuery({
    queryKey: problemPostKeys.myPostsList(page, size),
    queryFn: () => getMyProblemPosts(page, size),
    enabled: enabled && isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateProblemPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProblemPostRequest) => createProblemPost(data),
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: problemPostKeys.lists() });
      queryClient.invalidateQueries({ queryKey: problemPostKeys.myPosts() });

      queryClient.setQueryData(problemPostKeys.detail(newPost.id), newPost);
    },
    onError: (error) => {
      console.error("Error creating problem post:", error);
    },
  });
};

export const useUpdateProblemPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProblemPostRequest;
    }) => updateProblemPost(id, data),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(
        problemPostKeys.detail(updatedPost.id),
        updatedPost
      );

      queryClient.invalidateQueries({ queryKey: problemPostKeys.lists() });
      queryClient.invalidateQueries({ queryKey: problemPostKeys.myPosts() });
    },
    onError: (error) => {
      console.error("Error updating problem post:", error);
    },
  });
};

export const useDeleteProblemPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProblemPost(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: problemPostKeys.lists() });
      queryClient.invalidateQueries({ queryKey: problemPostKeys.myPosts() });

      queryClient.removeQueries({
        queryKey: problemPostKeys.detail(deletedId),
      });

      queryClient.setQueriesData(
        { queryKey: problemPostKeys.lists() },
        (oldData: ProblemPostResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: oldData.content.filter((post) => post.id !== deletedId),
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

export const useSearchProblemPosts = (
  query?: string,
  language?: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: problemPostKeys.searchList(query, language, page, size, sortBy, sortDir),
    queryFn: () => searchProblemPosts(query, language, page, size, sortBy, sortDir),
    enabled: enabled && !!(query?.trim() || language),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
