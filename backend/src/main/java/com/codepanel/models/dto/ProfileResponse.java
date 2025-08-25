package com.codepanel.models.dto;

import com.codepanel.models.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String profilePictureUrl;
}
