package com.codepanel.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatsResponse {
    private long problemsPosted;
    private long totalSubmissions;
    private Double averageGrade;
    private long totalPoints;
}
