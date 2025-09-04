import { PaginatedResponse, UserInfo } from "./shared";

export interface Comment {
  id: string;
  comment: string;
  code?: string;
  likes: number;
  dislikes: number;
  author: UserInfo;
  createdAt: string;
  updatedAt: string;
  userReaction?: "LIKE" | "DISLIKE" | null;
  isAccepted?: boolean;
}

export interface CreateCommentRequest {
  comment: string;
  code?: string;
}

export interface UpdateCommentRequest {
  comment: string;
  code?: string;
}

export type CommentResponse = PaginatedResponse<Comment>;
