"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Heart,
  AlertCircle,
  ExternalLink,
  Trophy,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/types/notifications";
import { useMarkAsRead } from "@/hooks/use-notifications";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  showActions?: boolean;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "COMMENT":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "ASSIGNMENT_CREATED":
      return <BookOpen className="h-4 w-4 text-green-500" />;
    case "ASSIGNMENT_GRADED":
      return <GraduationCap className="h-4 w-4 text-purple-500" />;
    case "ASSIGNMENT_SUBMITTED":
      return <FileText className="h-4 w-4 text-blue-600" />;
    case "ASSIGNMENT_DUE":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case "LIKE":
    case "PROBLEM_POST_LIKED":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "ACHIEVEMENT_AWARDED":
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case "SYSTEM":
      return <Bell className="h-4 w-4 text-gray-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export const NotificationItem = ({
  notification,
  onClick,
  showActions = true,
}: NotificationItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }

    onClick?.();
  };

  return (
    <div
      className={cn(
        "p-4 border-l-4 transition-all duration-200 hover:shadow-md",
        "bg-white border-gray-200 opacity-75 hover:bg-opacity-80",
        notification.actionUrl && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4
                className={cn(
                  "text-sm font-medium text-gray-900",
                  !notification.isRead && "font-semibold"
                )}
              >
                {notification.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {notification.message}
              </p>
            </div>

            {!notification.isRead && (
              <div className="flex-shrink-0 ml-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>

            {showActions && (
              <div className="flex items-center space-x-2">
                {notification.actionUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(notification.actionUrl!);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
