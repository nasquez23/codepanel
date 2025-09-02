package com.codepanel.models.dto;

import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ScoreEventType;
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
public class GamificationEvent {
    private ScoreEventType eventType;
    private UUID userId;
    private DifficultyLevel difficulty;
    private String refType;
    private UUID refId;
}


