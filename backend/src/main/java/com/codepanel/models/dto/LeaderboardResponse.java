package com.codepanel.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardResponse {
    private UserInfo user;
    private Integer points;
    private Integer rank;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String profilePictureUrl;
    }
}
