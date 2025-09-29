import {
  useProblemPost,
  usePrefetchProblemPost,
  useProblemPosts,
} from "./use-problem-posts";

export const useProblemPostDetails = (id: string) => {
  const {
    data: problemPost,
    isLoading,
    isError,
    error,
    refetch,
  } = useProblemPost(id);

  const prefetchProblemPost = usePrefetchProblemPost();

  return {
    problemPost,
    isLoading,
    isError,
    error,
    refetch,
    prefetchProblemPost,
  };
};

// Hook for "My Posts" page with additional user-specific functionality
export const useMyProblemPostsPage = (page: number = 0, size: number = 10) => {
  return {
    // You can add additional logic here specific to the "My Posts" page
    // For now, we'll just re-export the main hook
    ...useProblemPosts(page, size),
  };
};
