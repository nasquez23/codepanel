package com.codepanel.services;

import com.codepanel.models.User;
import com.codepanel.models.ScoreEvent;
import com.codepanel.models.UserScore;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ScoreEventType;
import com.codepanel.repositories.ScoreEventRepository;
import com.codepanel.repositories.UserScoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class GamificationService {
    private final ScoreEventRepository scoreEventRepository;
    private final UserScoreRepository userScoreRepository;

    public GamificationService(ScoreEventRepository scoreEventRepository,
            UserScoreRepository userScoreRepository) {
        this.scoreEventRepository = scoreEventRepository;
        this.userScoreRepository = userScoreRepository;
    }

    private int difficultyMultiplier(DifficultyLevel difficulty) {
        if (difficulty == null)
            return 1;
        return switch (difficulty) {
            case BEGINNER -> 1;
            case EASY -> 1;
            case MEDIUM -> 2;
            case HARD -> 3;
            case EXPERT -> 5;
        };
    }

    @Transactional
    public void recordEvent(User user, ScoreEventType type, DifficultyLevel difficulty,
            int basePoints, String refType, java.util.UUID refId) {
        // idempotency: avoid duplicates per (user,type,refId)
        if (refId != null && scoreEventRepository.existsByUserAndEventTypeAndRefId(user, type, refId)) {
            return;
        }

        System.out.println("Recording event: " + user.getEmail() + " " + type + " " + difficulty + " " + basePoints
                + " " + refType + " " + refId);

        int points = basePoints * difficultyMultiplier(difficulty);

        ScoreEvent event = new ScoreEvent();
        event.setUser(user);
        event.setEventType(type);
        event.setDifficulty(difficulty);
        event.setPoints(points);
        event.setRefType(refType);
        event.setRefId(refId);
        scoreEventRepository.save(event);

        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        UserScore score = userScoreRepository.findByUserAndWeekStart(user, weekStart);
        if (score == null) {
            score = new UserScore();
            score.setUser(user);
            score.setWeekStart(weekStart);
            score.setPoints(0);
        }
        score.setPoints(score.getPoints() + points);
        userScoreRepository.save(score);
    }

    @Transactional(readOnly = true)
    public Page<UserScore> getWeeklyLeaderboard(LocalDate weekStart, int page, int size) {
        LocalDate ws = (weekStart != null) ? weekStart : LocalDate.now().with(DayOfWeek.MONDAY);
        try {
            return userScoreRepository.findByWeekStartOrderByPointsDesc(ws, PageRequest.of(page, size));
        } catch (Exception e) {
            System.out.println("Error getting weekly leaderboard: " + e.getMessage());
            return Page.empty();
        }
    }

    @Transactional(readOnly = true)
    public List<Object[]> getMonthlyLeaderboard(YearMonth month, int limit) {
        YearMonth targetMonth = (month != null) ? month : YearMonth.now();
        LocalDate monthStart = targetMonth.atDay(1);
        LocalDate monthEnd = targetMonth.atEndOfMonth();

        try {
            return scoreEventRepository.findMonthlyLeaderboard(monthStart, monthEnd, PageRequest.of(0, limit));
        } catch (Exception e) {
            System.out.println("Error getting monthly leaderboard: " + e.getMessage());
            return List.of();
        }
    }

    @Transactional(readOnly = true)
    public List<Object[]> getAllTimeLeaderboard(int limit) {
        try {
            return scoreEventRepository.findAllTimeLeaderboard(PageRequest.of(0, limit));
        } catch (Exception e) {
            System.out.println("Error getting all-time leaderboard: " + e.getMessage());
            return List.of();
        }
    }
}
