package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ScoreEventType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "score_events", indexes = {
        @Index(name = "idx_score_events_user_time", columnList = "user_id,created_at"),
        @Index(name = "idx_score_events_type", columnList = "event_type")
})
public class ScoreEvent extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private ScoreEventType eventType;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "ref_type")
    private String refType;

    @Column(name = "ref_id")
    private UUID refId;
}
