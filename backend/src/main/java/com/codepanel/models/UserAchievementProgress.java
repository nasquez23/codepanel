package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import com.codepanel.models.enums.MetricType;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;

@Entity
@Table(name = "user_achievement_progress", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id",
        "metric_type" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAchievementProgress extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false)
    private MetricType metricType;

    @Column(name = "current_value", nullable = false)
    private Integer currentValue = 0;

    @Column(name = "last_updated", nullable = false)
    private LocalDate lastUpdated;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "streak_data", columnDefinition = "jsonb")
    private JsonNode streakData; // for streak-specific data like last_action_date
}
