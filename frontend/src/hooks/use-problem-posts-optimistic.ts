import { useQueryClient } from "@tanstack/react-query";
import { ProblemPost, ProblemPostResponse, CreateProblemPostRequest } from "@/types/problem-post";
import { problemPostKeys } from "./use-problem-posts";
import { useAuth } from "./use-auth";

// Hook for optimistic updates and advanced caching strategies
export const useProblemPostsOptimistic = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Optimistically add a new problem post to the cache
  const addOptimisticPost = (newPost: CreateProblemPostRequest) => {
    if (!user) return;

    const optimisticPost: ProblemPost = {
      id: `temp-${Date.now()}`, // Temporary ID
      title: newPost.title,
      description: newPost.description,
      code: newPost.code,
      language: newPost.language,
      author: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to the first page of the list
    queryClient.setQueryData(
      problemPostKeys.list(0, 10, "createdAt", "desc"),
      (oldData: ProblemPostResponse | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          content: [optimisticPost, ...oldData.content.slice(0, 9)], // Keep only 10 items
          totalElements: oldData.totalElements + 1,
        };
      }
    );

    return optimisticPost.id;
  };

  // Remove optimistic post (in case of error)
  const removeOptimisticPost = (tempId: string) => {
    queryClient.setQueriesData(
      { queryKey: problemPostKeys.lists() },
      (oldData: ProblemPostResponse | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          content: oldData.content.filter(post => post.id !== tempId),
          totalElements: Math.max(0, oldData.totalElements - 1),
        };
      }
    );
  };

  // Update optimistic post with real data
  const updateOptimisticPost = (tempId: string, realPost: ProblemPost) => {
    queryClient.setQueriesData(
      { queryKey: problemPostKeys.lists() },
      (oldData: ProblemPostResponse | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          content: oldData.content.map(post => 
            post.id === tempId ? realPost : post
          ),
        };
      }
    );

    // Also set the individual post data
    queryClient.setQueryData(
      problemPostKeys.detail(realPost.id),
      realPost
    );
  };

  // Prefetch related data
  const prefetchUserPosts = () => {
    queryClient.prefetchQuery({
      queryKey: problemPostKeys.myPostsList(0, 10),
      staleTime: 2 * 60 * 1000,
    });
  };

  // Invalidate all problem post queries (useful for global updates)
  const invalidateAllPosts = () => {
    queryClient.invalidateQueries({ queryKey: problemPostKeys.all });
  };

  return {
    addOptimisticPost,
    removeOptimisticPost,
    updateOptimisticPost,
    prefetchUserPosts,
    invalidateAllPosts,
  };
};
