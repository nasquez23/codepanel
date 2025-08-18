export interface Comment {
  id: string;
  comment: string;
  code?: string;
  likes: number;
  dislikes: number;
  author: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateCommentRequest {
  comment: string;
  code?: string;
}

export interface UpdateCommentRequest {
  comment: string;
  code?: string;
}

export interface CommentResponse {
  content: Comment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
