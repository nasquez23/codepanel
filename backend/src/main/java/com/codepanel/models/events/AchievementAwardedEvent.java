package com.codepanel.models.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementAwardedEvent {
    private UUID achievementId;
    private String achievementName;
    private String achievementDescription;
    private UUID userId;
    private String userName;
    private Integer pointsReward;
    private LocalDateTime awardedAt;
}
