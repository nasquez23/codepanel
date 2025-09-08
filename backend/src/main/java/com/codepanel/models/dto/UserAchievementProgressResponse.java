package com.codepanel.models.dto;

import com.codepanel.models.enums.MetricType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAchievementProgressResponse {
    private MetricType metricType;
    private Integer currentValue;
    private LocalDate lastUpdated;
    private String displayName;
}
