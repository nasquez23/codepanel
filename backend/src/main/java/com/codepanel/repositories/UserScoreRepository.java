package com.codepanel.repositories;

import com.codepanel.models.User;
import com.codepanel.models.UserScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface UserScoreRepository extends JpaRepository<UserScore, java.util.UUID> {
    UserScore findByUserAndWeekStart(User user, LocalDate weekStart);
    Page<UserScore> findByWeekStartOrderByPointsDesc(LocalDate weekStart, Pageable pageable);
}


