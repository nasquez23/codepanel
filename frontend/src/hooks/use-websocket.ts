import { useEffect, useRef, useState } from "react";
import { webSocketService } from "@/services/websocket-service";
import { useAuth } from "@/hooks/use-auth";
import {
  notificationKeys,
  useAddNotification,
  useUnreadCount,
  useUpdateUnreadCount,
} from "@/hooks/use-notifications";
import { ConnectionStatus, Notification } from "@/types/notifications";
import { useQueryClient } from "@tanstack/react-query";

export const useWebSocket = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    reconnectAttempts: 0,
  });
  const qc = useQueryClient();

  const addNotification = useAddNotification();
  const updateUnreadCount = useUpdateUnreadCount();
  const { data: unreadCount } = useUnreadCount();
  console.log("Unread count:", unreadCount);

  const addNotificationRef = useRef(addNotification);
  const updateUnreadCountRef = useRef(updateUnreadCount);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    addNotificationRef.current = addNotification;
    updateUnreadCountRef.current = updateUnreadCount;
  }, [addNotification, updateUnreadCount]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      webSocketService.disconnect();
      return;
    }

    // Prevent multiple connections
    if (webSocketService.isConnected()) {
      console.log("WebSocket already connected, skipping connection attempt");
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (isConnectingRef.current) {
      console.log("WebSocket connection already in progress, skipping");
      return;
    }

    const connectWebSocket = async () => {
      try {
        isConnectingRef.current = true;

        webSocketService.setOnNotificationReceived(
          (notification: Notification) => {
            console.error("Notification received:", notification);
            addNotificationRef.current(notification);
            
            // AGGRESSIVE FALLBACK: Force server fetch immediately since WebSocket unread count is not working
            setTimeout(() => {
              console.warn("🚨 AGGRESSIVE FALLBACK: WebSocket unread count not working, forcing server fetch");
              qc.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
            }, 1000); // Reduced to 1 second since WebSocket unread count is broken
          }
        );

        webSocketService.setOnUnreadCountUpdated((count: number) => {
          const now = new Date();
          console.log(`🔔 HOOK: Unread count update received via WebSocket: ${count} at ${now.toLocaleTimeString()}.${now.getMilliseconds()}`);
          console.warn(`🚨 VISIBLE: WebSocket received count ${count} at ${now.toLocaleTimeString()}.${now.getMilliseconds()}`);
          console.warn(`🚨 WEBSOCKET SUCCESS: Unread count update received and processed!`);
          updateUnreadCountRef.current(count);
          console.log(`🔔 HOOK: updateUnreadCountRef called at ${new Date().toLocaleTimeString()}.${new Date().getMilliseconds()}`);
        });

        webSocketService.setOnConnectionStatusChanged(
          (status: ConnectionStatus) => {
            setConnectionStatus(status);
          }
        );

        console.log("Connecting to WebSocket", accessToken);
        console.warn("🚨 HOOK: About to call webSocketService.connect()");
        await webSocketService.connect(accessToken);
        console.warn("🚨 HOOK: webSocketService.connect() completed");
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
      } finally {
        isConnectingRef.current = false;
      }
    };

    connectWebSocket();

    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated, accessToken, isLoading]);

  // Ping interval to keep connection alive
  useEffect(() => {
    if (!connectionStatus.connected) return;

    const pingInterval = setInterval(() => {
      if (webSocketService.isConnected()) {
        console.log("Sending WebSocket ping to keep connection alive");
        webSocketService.sendPing();
      } else {
        console.warn("WebSocket ping failed - connection not active");
      }
    }, 10000); // Balanced ping interval (10 seconds)

    return () => clearInterval(pingInterval);
  }, [connectionStatus.connected]);

  // SMART PERIODIC CHECK: Ensure unread count is always accurate (more frequent since WebSocket is broken)
  useEffect(() => {
    if (!connectionStatus.connected) return;

    const unreadCountCheckInterval = setInterval(() => {
      console.warn("🚨 SMART PERIODIC CHECK: Verifying unread count accuracy");
      qc.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    }, 10000); // Check every 10 seconds since WebSocket unread count is not working

    return () => clearInterval(unreadCountCheckInterval);
  }, [connectionStatus.connected, qc]);

  // Handle page visibility changes - reconnect when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && accessToken) {
        console.log("Tab became visible, checking WebSocket connection");
        
        // Check if connection is still alive after a short delay
        setTimeout(() => {
          if (!webSocketService.isConnected()) {
            console.log("WebSocket disconnected while tab was hidden, reconnecting...");
            reconnect();
          } else {
            console.log("WebSocket still connected after tab focus");
          }
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated, accessToken]);

  const sendMessage = (destination: string, body: any) => {
    webSocketService.sendMessage(destination, body);
  };

  const reconnect = () => {
    if (accessToken) {
      webSocketService.disconnect();
      setTimeout(() => {
        webSocketService.connect(accessToken);
      }, 1000);
    }
  };

  return {
    connectionStatus,
    isConnected: connectionStatus.connected,
    sendMessage,
    reconnect,
  };
};
