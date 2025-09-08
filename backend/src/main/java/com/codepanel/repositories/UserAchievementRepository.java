package com.codepanel.repositories;

import com.codepanel.models.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UUID> {
    @Query("SELECT ua FROM UserAchievement ua JOIN FETCH ua.achievement WHERE ua.user.id = :userId ORDER BY ua.createdAt DESC")
    List<UserAchievement> findByUserIdWithAchievement(@Param("userId") UUID userId);

    @Query("SELECT COUNT(ua) FROM UserAchievement ua WHERE ua.user.id = :userId")
    Integer countByUserId(@Param("userId") UUID userId);

    boolean existsByUserIdAndAchievementId(UUID userId, UUID achievementId);
}
