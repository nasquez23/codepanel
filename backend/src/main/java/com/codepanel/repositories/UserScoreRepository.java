package com.codepanel.repositories;

import com.codepanel.models.User;
import com.codepanel.models.UserScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface UserScoreRepository extends JpaRepository<UserScore, java.util.UUID> {
    UserScore findByUserAndWeekStart(User user, LocalDate weekStart);

    Page<UserScore> findByWeekStartOrderByPointsDesc(LocalDate weekStart, Pageable pageable);

    @Query("SELECT SUM(us.points) FROM UserScore us WHERE us.user.id = :userId")
    Integer sumPointsByUserId(@Param("userId") UUID userId);
}
