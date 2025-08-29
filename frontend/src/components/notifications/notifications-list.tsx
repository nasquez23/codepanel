"use client";

import { useState } from "react";
import { Bell, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "./notification-item";
import { useNotifications, useMarkAllAsRead } from "@/hooks/use-notifications";

interface NotificationsListProps {
  onNotificationClick?: () => void;
  maxHeight?: string;
}

export const NotificationsList = ({
  onNotificationClick,
  maxHeight = "max-h-96",
}: NotificationsListProps) => {
  const [page, setPage] = useState(0);
  const size = 10;

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useNotifications(page, size);

  const markAllAsReadMutation = useMarkAllAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleLoadMore = () => {
    if (notificationsData && !notificationsData.last) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className={`${maxHeight} overflow-hidden`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-600">
            Loading notifications...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${maxHeight} overflow-hidden`}>
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <Bell className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">Failed to load notifications</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const notifications = notificationsData?.content || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="w-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
            {notificationsData && (
              <span className="ml-2 text-xs text-gray-500">
                ({notificationsData.totalElements})
              </span>
            )}
          </h3>

          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              {markAllAsReadMutation.isPending ? "Marking..." : "Mark all read"}
            </Button>
          )}
        </div>
      </div>

      <div className={`${maxHeight} overflow-y-auto`}>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <Bell className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">No notifications yet</p>
            <p className="text-xs text-gray-500">
              You'll see new notifications here when they arrive
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}
          </div>
        )}

        {notificationsData && !notificationsData.last && (
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              disabled={isFetching}
              className="w-full"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}
      </div>

      {isFetching && notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-blue-50">
          <div className="flex items-center justify-center text-xs text-blue-600">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Refreshing...
          </div>
        </div>
      )}
    </div>
  );
};
