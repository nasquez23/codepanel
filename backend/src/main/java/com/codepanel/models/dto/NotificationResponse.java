package com.codepanel.models.dto;

import com.codepanel.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private UUID id;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private UUID relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private UUID recipientUserId;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
