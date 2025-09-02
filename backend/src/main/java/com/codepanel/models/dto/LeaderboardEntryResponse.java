package com.codepanel.models.dto;

import com.codepanel.models.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String profilePictureUrl;
    }

    private String id;
    private UserInfo user;
    private String weekStart;
    private Integer points;
}


