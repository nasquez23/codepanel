package com.codepanel.models.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponse {
    private String accessToken;
    
    @JsonIgnore
    private String refreshToken;
    
    private String tokenType = "Bearer";
    private Long expiresIn;
    private String familyId;

    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
} 