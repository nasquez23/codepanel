package com.codepanel.repositories;

import com.codepanel.models.ScoreEvent;
import com.codepanel.models.User;
import com.codepanel.models.enums.ScoreEventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScoreEventRepository extends JpaRepository<ScoreEvent, java.util.UUID> {
    List<ScoreEvent> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);
    boolean existsByUserAndEventTypeAndRefId(User user, ScoreEventType eventType, java.util.UUID refId);
}


