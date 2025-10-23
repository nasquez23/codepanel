import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/services/notifications-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { achievementKeys } from "@/hooks/use-achievements";
import { Notification } from "@/types/notifications";
import { flushSync } from "react-dom";

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
    staleTime: 0,
    gcTime: 1000 * 60 * 2,
    enabled: enabled && isAuthenticated,
    refetchOnWindowFocus: false, // Rely on WebSocket for real-time updates
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
    const now = new Date();
    console.log(`🔄 QUERY: updateUnreadCount called with ${newCount} at ${now.toLocaleTimeString()}.${now.getMilliseconds()}`);
    console.warn(`🚨 VISIBLE: Unread count updating to ${newCount} at ${now.toLocaleTimeString()}.${now.getMilliseconds()}`);
    
    // Force immediate synchronous React update
    // flushSync(() => {
    //   queryClient.setQueryData(notificationKeys.unreadCount(), {
    //     count: newCount,
    //   });
    // });

    console.log(`🔄 QUERY: flushSync completed at ${new Date().toLocaleTimeString()}.${new Date().getMilliseconds()}`);
    console.warn(`🚨 VISIBLE: React state updated to ${newCount} at ${new Date().toLocaleTimeString()}.${new Date().getMilliseconds()}`);

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
    console.log("New notification received:", notification);

    // SMART FALLBACK: Increment locally immediately, then let server correct it
    queryClient.setQueryData(notificationKeys.unreadCount(), (old: any) => {
      const newCount = (old?.count || 0) + 1;
      console.warn(`🚨 SMART FALLBACK: Incrementing unread count from ${old?.count || 0} to ${newCount}`);
      return { count: newCount };
    });

    // Also trigger a server fetch as backup after a delay (reduced since WebSocket is broken)
    setTimeout(() => {
      console.warn("🚨 SMART FALLBACK: Triggering server fetch for unread count");
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    }, 500); // Reduced to 500ms since WebSocket unread count is not working

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
