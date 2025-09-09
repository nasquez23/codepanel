package com.codepanel.models.dto;

import com.codepanel.models.enums.ReactionType;
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
public class CommentResponse {
    private UUID id;
    private String comment;
    private String code;
    private Integer likes;
    private Integer dislikes;
    private UserInfo author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ReactionType userReaction;
    private Boolean isAccepted;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private String profilePictureUrl;
    }
}
