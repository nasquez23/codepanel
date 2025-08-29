"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NotificationsList } from "./notifications-list";
import { useUnreadCount } from "@/hooks/use-notifications";

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationsDropdown = ({
  className,
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCountData } = useUnreadCount();

  const unreadCount = unreadCountData?.count || 0;
  const hasUnread = unreadCount > 0;

  const handleNotificationClick = () => {
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("relative h-9 w-9 p-0 hover:bg-gray-100", className)}
        >
          <Bell className="h-4 w-4" />

          {hasUnread && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={5}>
        <NotificationsList
          onNotificationClick={handleNotificationClick}
          maxHeight="max-h-96"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
