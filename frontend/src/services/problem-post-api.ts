import {
  CreateProblemPostRequest,
  UpdateProblemPostRequest,
  ProblemPost,
  ProblemPostResponse,
} from "../types/problem-post";
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
