import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Notification, ConnectionStatus } from "@/types/notifications";

export class WebSocketService {
  private stompClient: Client | null = null;
  private connectionStatus: ConnectionStatus = {
    connected: false,
    reconnectAttempts: 0,
  };
  private reconnectInterval: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  private onNotificationReceived:
    | ((notification: Notification) => void)
    | null = null;
  private onUnreadCountUpdated: ((count: number) => void) | null = null;
  private onConnectionStatusChanged:
    | ((status: ConnectionStatus) => void)
    | null = null;

  constructor() {}

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stompClient?.connected) {
        console.log("WebSocket already connected");
        resolve();
        return;
      }

      try {
        this.stompClient = new Client({
          webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => {
            if (process.env.NODE_ENV === "development") {
              // console.log(str);
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame) => {
            console.log("Connected to WebSocket:", frame);
            this.connectionStatus = {
              connected: true,
              userId: frame.headers["user-name"],
              lastConnected: new Date(),
              reconnectAttempts: 0,
            };

            this.onConnectionStatusChanged?.(this.connectionStatus);
            this.subscribeToNotifications();
            this.clearReconnectTimer();
            resolve();
          },
          onStompError: (frame) => {
            console.error("STOMP error:", frame);
            this.connectionStatus.connected = false;
            this.onConnectionStatusChanged?.(this.connectionStatus);
            reject(new Error(frame.body));
          },
          onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
            this.connectionStatus.connected = false;
            this.onConnectionStatusChanged?.(this.connectionStatus);
            this.handleReconnect(token);
            reject(error);
          },
          onDisconnect: () => {
            console.log("WebSocket disconnected");
            this.connectionStatus.connected = false;
            this.onConnectionStatusChanged?.(this.connectionStatus);
          },
        });

        this.stompClient.activate();
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
        reject(error);
      }
    });
  }

  private subscribeToNotifications() {
    if (!this.stompClient?.connected) return;

    try {
      this.stompClient.subscribe(
        "/user/queue/notifications",
        (message: any) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            console.log("Received notification:", notification);
            this.onNotificationReceived?.(notification);
          } catch (error) {
            console.error("Error parsing notification message:", error);
          }
        }
      );

      this.stompClient.subscribe("/user/queue/unread-count", (message: any) => {
        try {
          const count = JSON.parse(message.body);
          console.log("Unread count updated:", count);
          this.onUnreadCountUpdated?.(count);
        } catch (error) {
          console.error("Error parsing unread count message:", error);
        }
      });

      this.stompClient.subscribe("/topic/announcements", (message: any) => {
        try {
          const announcement = JSON.parse(message.body);
          console.log("System announcement:", announcement);
        } catch (error) {
          console.error("Error parsing announcement message:", error);
        }
      });

      this.sendMessage("/app/connect", {});
    } catch (error) {
      console.error("Error subscribing to WebSocket topics:", error);
    }
  }

  private handleReconnect(token: string) {
    if (this.connectionStatus.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.connectionStatus.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.connectionStatus.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    this.reconnectInterval = setTimeout(() => {
      this.connect(token).catch(() => {
        // Reconnect will be handled by the error callback
      });
    }, this.reconnectDelay * this.connectionStatus.reconnectAttempts);
  }

  private clearReconnectTimer() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  sendMessage(destination: string, body: any) {
    if (this.stompClient?.connected) {
      try {
        this.stompClient.publish({ destination, body: JSON.stringify(body) });
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
      }
    } else {
      console.warn("Cannot send message: WebSocket not connected");
    }
  }

  sendPing() {
    this.sendMessage("/app/ping", { timestamp: Date.now() });
  }

  disconnect() {
    this.clearReconnectTimer();

    if (this.stompClient?.connected) {
      try {
        this.stompClient.deactivate();
        console.log("WebSocket disconnected");
      } catch (error) {
        console.error("Error disconnecting WebSocket:", error);
      }
    }

    this.stompClient = null;
    this.connectionStatus.connected = false;
    this.onConnectionStatusChanged?.(this.connectionStatus);
  }

  setOnNotificationReceived(handler: (notification: Notification) => void) {
    this.onNotificationReceived = handler;
  }

  setOnUnreadCountUpdated(handler: (count: number) => void) {
    this.onUnreadCountUpdated = handler;
  }

  setOnConnectionStatusChanged(handler: (status: ConnectionStatus) => void) {
    this.onConnectionStatusChanged = handler;
  }

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }
}

export const webSocketService = new WebSocketService();
