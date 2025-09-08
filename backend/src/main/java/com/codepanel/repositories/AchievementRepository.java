package com.codepanel.repositories;

import com.codepanel.models.Achievement;
import com.codepanel.models.enums.AchievementCategory;
import com.codepanel.models.enums.MetricType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    List<Achievement> findByCategory(AchievementCategory category);

    List<Achievement> findByMetricType(MetricType metricType);

    @Query("SELECT a FROM Achievement a WHERE a.metricType = :metricType AND a.targetValue <= :currentValue ORDER BY a.targetValue DESC")
    List<Achievement> findEligibleAchievements(@Param("metricType") MetricType metricType,
            @Param("currentValue") Integer currentValue);
}
