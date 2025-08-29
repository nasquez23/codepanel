import { useEffect, useRef, useState } from "react";
import { webSocketService } from "@/services/websocket-service";
import { useAuth } from "@/hooks/use-auth";
import {
  useAddNotification,
  useUpdateUnreadCount,
} from "@/hooks/use-notifications";
import { ConnectionStatus, Notification } from "@/types/notifications";

export const useWebSocket = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    reconnectAttempts: 0,
  });

  const addNotification = useAddNotification();
  const updateUnreadCount = useUpdateUnreadCount();

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
            addNotificationRef.current(notification);
          }
        );

        webSocketService.setOnUnreadCountUpdated((count: number) => {
          updateUnreadCountRef.current(count);
        });

        webSocketService.setOnConnectionStatusChanged(
          (status: ConnectionStatus) => {
            setConnectionStatus(status);
          }
        );

        console.log("Connecting to WebSocket", accessToken);
        await webSocketService.connect(accessToken);
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
        webSocketService.sendPing();
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, [connectionStatus.connected]);

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
