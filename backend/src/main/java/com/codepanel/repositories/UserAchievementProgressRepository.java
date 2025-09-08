package com.codepanel.repositories;

import com.codepanel.models.UserAchievementProgress;
import com.codepanel.models.enums.MetricType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAchievementProgressRepository extends JpaRepository<UserAchievementProgress, UUID> {
    Optional<UserAchievementProgress> findByUserIdAndMetricType(UUID userId, MetricType metricType);

    @Query("SELECT uap FROM UserAchievementProgress uap WHERE uap.user.id = :userId")
    List<UserAchievementProgress> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT uap FROM UserAchievementProgress uap WHERE uap.metricType = :metricType")
    List<UserAchievementProgress> findByMetricType(@Param("metricType") MetricType metricType);
}
