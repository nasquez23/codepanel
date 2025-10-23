package com.codepanel.services;

import com.codepanel.models.Notification;
import com.codepanel.models.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(UUID userId, Notification notification) {
        try {
            NotificationResponse response = mapToResponse(notification);

            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    response);
        } catch (Exception e) {
            System.err.println("❌ Failed to send WebSocket notification to user: " + userId +
                    ", error: " + e.getMessage());
        }
    }

    public void sendUnreadCountToUser(UUID userId, Long unreadCount) {
        System.out.println("Sending unread count to user: " + userId + " with count: " + unreadCount);
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/unread-count",
                    unreadCount);
            System.out.println("Unread count sent to user: " + userId + " with count: " + unreadCount);
        } catch (Exception e) {
            System.err.println("❌ Failed to send unread count to user: " + userId +
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
                .recipientUserId(notification.getRecipient().getId())
                .build();
    }
}
