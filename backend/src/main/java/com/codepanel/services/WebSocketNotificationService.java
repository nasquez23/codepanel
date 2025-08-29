package com.codepanel.services;

import com.codepanel.models.Notification;
import com.codepanel.models.dto.NotificationResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotificationToUser(UUID userId, Notification notification) {
        try {
            NotificationResponse response = mapToResponse(notification);

            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    response);

            System.out.println("Sent WebSocket notification to user: " + userId +
                    ", notification ID: " + notification.getId());

        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification to user: " + userId +
                    ", error: " + e.getMessage());
        }
    }

    public void sendUnreadCountToUser(UUID userId, Long unreadCount) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/unread-count",
                    unreadCount);

            System.out.println("Sent unread count update to user: " + userId +
                    ", count: " + unreadCount);

        } catch (Exception e) {
            System.err.println("Failed to send unread count to user: " + userId +
                    ", error: " + e.getMessage());
        }
    }

    public void broadcastNotification(String message) {
        try {
            messagingTemplate.convertAndSend("/topic/announcements", message);
            System.out.println("Broadcasted system notification: " + message);
        } catch (Exception e) {
            System.err.println("Failed to broadcast notification, error: " + e.getMessage());
        }
    }

    public void sendRealTimeUpdate(String destination, Object payload) {
        try {
            messagingTemplate.convertAndSend(destination, payload);
        } catch (Exception e) {
            System.err.println("Failed to send real-time update to " + destination +
                    ", error: " + e.getMessage());
        }
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .relatedEntityId(notification.getRelatedEntityId())
                .relatedEntityType(notification.getRelatedEntityType())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
