package com.codepanel.models.events;

import com.codepanel.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationEvent {
    private UUID recipientId;
    private String recipientEmail;
    private String recipientName;
    private NotificationType type;
    private String subject;
    private String templateName;
    private Map<String, Object> templateVariables;
}
