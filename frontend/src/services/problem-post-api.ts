import {
  CreateProblemPostRequest,
  UpdateProblemPostRequest,
  ProblemPost,
  ProblemPostResponse,
} from "../types/problem-post";
import { DifficultyLevel } from "../types/tags-categories";
import { poster, fetcher, deleter, putter } from "./api";

export const getAllProblemPosts = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
): Promise<ProblemPostResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });

  return fetcher<ProblemPostResponse>(`/api/problem-posts?${params}`);
};

export const getProblemPostById = async (id: string): Promise<ProblemPost> => {
  return fetcher<ProblemPost>(`/api/problem-posts/${id}`);
};

export const createProblemPost = async (
  data: CreateProblemPostRequest
): Promise<ProblemPost> => {
  const response = await poster<CreateProblemPostRequest, ProblemPost>(
    "/api/problem-posts",
    data
  );
  return response.data;
};

export const getMyProblemPosts = async (
  page: number = 0,
  size: number = 10
): Promise<ProblemPostResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  console.log(`/api/problem-posts/my-posts?${params}`);

  return fetcher<ProblemPostResponse>(`/api/problem-posts/my-posts?${params}`);
};

export const updateProblemPost = async (
  id: string,
  data: UpdateProblemPostRequest
): Promise<ProblemPost> => {
  const response = await putter<UpdateProblemPostRequest, ProblemPost>(
    `/api/problem-posts/${id}`,
    data
  );
  return response.data;
};

export const deleteProblemPost = async (id: string): Promise<void> => {
  await deleter(`/api/problem-posts/${id}`);
};

export const acceptAnswer = async (postId: string, commentId: string): Promise<ProblemPost> => {
  const response = await putter<{}, ProblemPost>(
    `/api/problem-posts/${postId}/accept-answer/${commentId}`,
    {}
  );
  return response.data;
};

export const unacceptAnswer = async (postId: string): Promise<void> => {
  await deleter(`/api/problem-posts/${postId}/unaccept-answer`);
};

export interface SearchProblemPostsParams {
  query?: string;
  language?: string;
  difficulty?: DifficultyLevel;
  categoryId?: string;
  tagIds?: string[];
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const searchProblemPosts = async (
  params: SearchProblemPostsParams = {}
): Promise<ProblemPostResponse> => {
  const {
    query,
    language,
    difficulty,
    categoryId,
    tagIds,
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc"
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });

  if (query && query.trim()) {
    searchParams.append("query", query.trim());
  }
  
  if (language) {
    searchParams.append("language", language);
  }

  if (difficulty) {
    searchParams.append("difficulty", difficulty);
  }

  if (categoryId) {
    searchParams.append("categoryId", categoryId);
  }

  if (tagIds && tagIds.length > 0) {
    tagIds.forEach(tagId => {
      searchParams.append("tagIds", tagId);
    });
  }

  return fetcher<ProblemPostResponse>(`/api/problem-posts/search?${searchParams}`);
};
