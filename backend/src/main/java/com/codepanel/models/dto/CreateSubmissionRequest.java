package com.codepanel.models.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSubmissionRequest {
    @NotBlank(message = "Code is required")
    private String code;
}

