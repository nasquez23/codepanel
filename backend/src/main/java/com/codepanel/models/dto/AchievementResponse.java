package com.codepanel.models.dto;

import com.codepanel.models.enums.AchievementCategory;
import com.codepanel.models.enums.MetricType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchievementResponse {
    private UUID id;
    private String name;
    private String description;
    private String icon;
    private AchievementCategory category;
    private MetricType metricType;
    private Integer targetValue;
    private Integer pointsReward;
    private LocalDateTime earnedAt;
}
