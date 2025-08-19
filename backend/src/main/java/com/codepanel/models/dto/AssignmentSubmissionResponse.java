package com.codepanel.models.dto;

import com.codepanel.models.enums.ProgrammingLanguage;
import com.codepanel.models.enums.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentSubmissionResponse {
    private UUID id;
    private AssignmentInfo assignment;
    private String code;
    private SubmissionStatus status;
    private Integer grade;
    private UserInfo student;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;
    private SubmissionReviewResponse review;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentInfo {
        private UUID id;
        private String title;
        private String description;
        private ProgrammingLanguage language;
        private UserInfo instructor;
        private LocalDateTime dueDate;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmissionReviewResponse {
        private UUID id;
        private String comment;
        private Integer score;
        private UserInfo reviewer;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

