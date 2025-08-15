package com.codepanel.models.dto;

import com.codepanel.models.enums.ProgrammingLanguage;
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
public class ProblemPostResponse {
    private UUID id;
    private String title;
    private String description;
    private String code;
    private ProgrammingLanguage language;
    private UserInfo author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
