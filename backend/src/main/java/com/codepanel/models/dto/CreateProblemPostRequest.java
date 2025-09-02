package com.codepanel.models.dto;

import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateProblemPostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    private String description;

    private String code;

    @NotNull(message = "Programming language is required")
    private ProgrammingLanguage language;

    @NotNull(message = "Difficulty level is required")
    private DifficultyLevel difficultyLevel;

    private UUID categoryId;

    private List<UUID> tagIds;
}
