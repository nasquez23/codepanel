import { fetcher, putter } from "./api";
import {
  NotificationResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
} from "@/types/notifications";

export const notificationsApi = {
  getNotifications: async (
    page = 0,
    size = 20
  ): Promise<NotificationResponse> => {
    return fetcher<NotificationResponse>(
      `/api/notifications?page=${page}&size=${size}`
    );
  },

  getUnreadNotifications: async (
    page = 0,
    size = 20
  ): Promise<NotificationResponse> => {
    return fetcher<NotificationResponse>(
      `/api/notifications/unread?page=${page}&size=${size}`
    );
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return fetcher<UnreadCountResponse>("/api/notifications/unread/count");
  },

  markAsRead: async (notificationId: string): Promise<MarkAsReadResponse> => {
    const response = await putter<{}, MarkAsReadResponse>(
      `/api/notifications/${notificationId}/read`,
      {}
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<MarkAllAsReadResponse> => {
    const response = await putter<{}, MarkAllAsReadResponse>(
      "/api/notifications/read-all",
      {}
    );
    return response.data;
  },
};
