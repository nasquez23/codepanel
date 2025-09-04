package com.codepanel.repositories;

import com.codepanel.models.ScoreEvent;
import com.codepanel.models.User;
import com.codepanel.models.enums.ScoreEventType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScoreEventRepository extends JpaRepository<ScoreEvent, java.util.UUID> {
       List<ScoreEvent> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

       boolean existsByUserAndEventTypeAndRefId(User user, ScoreEventType eventType, java.util.UUID refId);

       @Query("SELECT se.user, SUM(se.points) as totalPoints " +
                     "FROM ScoreEvent se " +
                     "WHERE DATE(se.createdAt) BETWEEN :monthStart AND :monthEnd " +
                     "GROUP BY se.user " +
                     "ORDER BY totalPoints DESC")
       List<Object[]> findMonthlyLeaderboard(@Param("monthStart") LocalDate monthStart,
                     @Param("monthEnd") LocalDate monthEnd,
                     Pageable pageable);

       @Query("SELECT se.user, SUM(se.points) as totalPoints " +
                     "FROM ScoreEvent se " +
                     "GROUP BY se.user " +
                     "ORDER BY totalPoints DESC")
       List<Object[]> findAllTimeLeaderboard(Pageable pageable);
}
