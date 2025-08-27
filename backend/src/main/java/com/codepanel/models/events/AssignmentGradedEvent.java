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
public class AssignmentGradedEvent {
    private UUID submissionId;
    private UUID assignmentId;
    private String assignmentTitle;
    private UUID studentId;
    private String studentName;
    private UUID reviewerId;
    private String reviewerName;
    private Integer score;
    private String comment;
    private LocalDateTime gradedAt;
}
