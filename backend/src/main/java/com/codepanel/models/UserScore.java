package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "user_scores", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_scores_user_week", columnNames = {"user_id", "week_start"})
})
public class UserScore extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;

    @Column(name = "points", nullable = false)
    private Integer points;
}


