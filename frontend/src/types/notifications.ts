export type NotificationType =
  | "COMMENT"
  | "LIKE"
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_DUE"
  | "ASSIGNMENT_GRADED"
  | "PROBLEM_POST_LIKED"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
}

export interface MarkAllAsReadResponse {
  markedCount: number;
}

export interface WebSocketMessage {
  type: "notification" | "unread-count" | "connection" | "pong" | "error";
  data: any;
}

export interface ConnectionStatus {
  connected: boolean;
  userId?: string;
  lastConnected?: Date;
  reconnectAttempts: number;
}
