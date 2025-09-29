import { fetcher, poster, patcher, deleter, putter } from "./api";
import {
  Comment,
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/types/comment";

export const getComments = async (
  problemPostId: string,
  page: number = 0,
  size: number = 5,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
): Promise<CommentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });
  return fetcher<CommentResponse>(
    `/api/problem-posts/${problemPostId}/comments?${params}`
  );
};

export const getComment = async (
  commentId: string,
  problemPostId: string
): Promise<Comment> => {
  return fetcher<Comment>(
    `/api/problem-posts/${problemPostId}/comments/${commentId}`
  );
};

export const createComment = async (
  problemPostId: string,
  data: CreateCommentRequest
): Promise<Comment> => {
  const response = await poster<CreateCommentRequest, Comment>(
    `/api/problem-posts/${problemPostId}/comments`,
    data
  );
  return response.data;
};

export const updateComment = async (
  commentId: string,
  problemPostId: string,
  data: UpdateCommentRequest
): Promise<Comment> => {
  const response = await putter<UpdateCommentRequest, Comment>(
    `/api/problem-posts/${problemPostId}/comments/${commentId}`,
    data
  );
  return response.data;
};

export const deleteComment = async (
  commentId: string,
  problemPostId: string
) => {
  return deleter<void>(
    `/api/problem-posts/${problemPostId}/comments/${commentId}`
  );
};

export const likeComment = async (
  commentId: string,
  problemPostId: string
): Promise<Comment> => {
  const response = await poster<any, Comment>(
    `/api/problem-posts/${problemPostId}/comments/${commentId}/like`,
    {}
  );
  return response.data;
};

export const dislikeComment = async (
  commentId: string,
  problemPostId: string
): Promise<Comment> => {
  const response = await poster<any, Comment>(
    `/api/problem-posts/${problemPostId}/comments/${commentId}/dislike`,
    {}
  );
  return response.data;
};

export const getCommentCount = async (
  problemPostId: string
): Promise<number> => {
  return fetcher<number>(`/api/problem-posts/${problemPostId}/comments/count`);
};

export const getMyComments = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "desc"
): Promise<CommentResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });
  return fetcher<CommentResponse>(`/api/my-comments?${params}`);
};
