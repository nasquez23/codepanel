package com.codepanel.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCommentRequest {
    @NotBlank(message = "Comment is required")
    @Size(min = 1, max = 2000, message = "Comment must be between 1 and 2000 characters")
    private String comment;

    @Size(max = 10000, message = "Code must not exceed 10000 characters")
    private String code;
}
