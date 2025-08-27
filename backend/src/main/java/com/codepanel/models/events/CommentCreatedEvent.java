package com.codepanel.models.events;

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
public class CommentCreatedEvent {
    private UUID commentId;
    private UUID problemPostId;
    private String problemPostTitle;
    private UUID commentAuthorId;
    private String commentAuthorName;
    private UUID postAuthorId;
    private String commentContent;
    private LocalDateTime createdAt;
}
