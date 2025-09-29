import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/services/notifications-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { achievementKeys } from "@/hooks/use-achievements";
import { Notification } from "@/types/notifications";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...notificationKeys.lists(), page, size] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
  unreadList: (page: number, size: number) =>
    [...notificationKeys.unread(), page, size] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export const useNotifications = (page = 0, size = 20) => {
  return useQuery({
    queryKey: notificationKeys.list(page, size),
    queryFn: () => notificationsApi.getNotifications(page, size),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

export const useUnreadNotifications = (page = 0, size = 20) => {
  return useQuery({
    queryKey: notificationKeys.unreadList(page, size),
    queryFn: () => notificationsApi.getUnreadNotifications(page, size),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });
};

export const useUnreadCount = (enabled = true) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60,
    enabled: enabled && isAuthenticated,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(notificationId),
    onSuccess: (data, notificationId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });

        queryClient.setQueryData(notificationKeys.unreadCount(), (old: any) => {
          if (old && old.count > 0) {
            return { count: old.count - 1 };
          }
          return old;
        });
      }
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });

      queryClient.setQueryData(notificationKeys.unreadCount(), { count: 0 });
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    },
  });
};

export const useUpdateUnreadCount = () => {
  const queryClient = useQueryClient();

  return (newCount: number) => {
    queryClient.setQueryData(notificationKeys.unreadCount(), {
      count: newCount,
    });

    queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
  };
};

export const useAddNotification = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (notification: Notification) => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    if (notification.type === "ACHIEVEMENT_AWARDED") {
      queryClient.invalidateQueries({ queryKey: achievementKeys.all });
    }

    toast.info(notification.title, {
      description: notification.message,
      action: notification.actionUrl
        ? {
            label: "View",
            onClick: () => router.push(notification.actionUrl || ""),
          }
        : undefined,
    });

    console.log("New notification received:", notification);
  };
};
