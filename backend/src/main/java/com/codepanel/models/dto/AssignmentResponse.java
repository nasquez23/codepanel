package com.codepanel.models.dto;

import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {
    private UUID id;
    private String title;
    private String description;
    private ProgrammingLanguage language;
    private DifficultyLevel difficultyLevel;
    private CategoryResponse category;
    private List<TagResponse> tags;
    private UserInfo instructor;
    private LocalDateTime dueDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer submissionCount;
    private Boolean hasSubmitted;
    private AssignmentSubmissionResponse mySubmission;

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
}

