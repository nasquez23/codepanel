package com.codepanel.models.dto;

import com.codepanel.models.SocialLinks;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateProfileRequest {
    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;

    private List<String> skills;

    private List<String> interests;

    private SocialLinks socialLinks;
}
