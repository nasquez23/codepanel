package com.codepanel.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstructorStatsResponse {
    private long totalAssignments;
    private long activeAssignments;
    private long totalSubmissions;
    private long pendingReviews;
}
