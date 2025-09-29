"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "./notification-item";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification as NotificationType } from "@/types/notifications";

interface NotificationsListProps {
  onNotificationClick?: () => void;
  maxHeight?: string;
}

export const NotificationsList = ({
  onNotificationClick,
  maxHeight = "max-h-96",
}: NotificationsListProps) => {
  const [page, setPage] = useState(0);
  const size = 5;

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useNotifications(page, size);

  const [allNotifications, setAllNotifications] = useState<NotificationType[]>(
    []
  );
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentPage = notificationsData?.number ?? 0;
    const content: NotificationType[] = notificationsData?.content ?? [];

    if (!notificationsData) return;

    if (currentPage === 0) {
      // Reset when first page loads
      const newSet = new Set<string>();
      content.forEach((n) => newSet.add(n.id));
      seenIdsRef.current = newSet;
      setAllNotifications(content);
    } else if (content.length > 0) {
      // Append only new items
      const appended: NotificationType[] = [];
      for (const n of content) {
        if (!seenIdsRef.current.has(n.id)) {
          seenIdsRef.current.add(n.id);
          appended.push(n);
        }
      }
      if (appended.length > 0) {
        setAllNotifications((prev) => [...prev, ...appended]);
      }
    }
  }, [notificationsData]);

  const handleLoadMore = () => {
    if (notificationsData && !notificationsData.last) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading && page === 0) {
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

  const notifications = allNotifications;

  return (
    <div className="w-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">
          Notifications
          {notificationsData && (
            <span className="ml-2 text-xs text-gray-500">
              ({notificationsData.totalElements})
            </span>
          )}
        </h3>
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
