package com.codepanel.services;

import com.codepanel.models.dto.GamificationEvent;
import com.codepanel.models.enums.MetricType;
import com.codepanel.models.enums.ScoreEventType;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

// @Service - DISABLED: Achievement processing moved to GamificationEventListener to avoid queue competition
public class AchievementEventListener {
    private final AchievementService achievementService;

    public AchievementEventListener(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @RabbitListener(queues = "gamification.events")
    public void onGamificationEvent(GamificationEvent event) {
        try {
            handleAchievementProgress(event);
        } catch (Exception e) {
            System.err.println("Error processing achievement event: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleAchievementProgress(GamificationEvent event) {
        System.out.println("=== HANDLING ACHIEVEMENT PROGRESS ===");
        System.out.println("Event details: " + event.getEventType() + " " + event.getUserId() + " " + event.getDifficulty() + " " + event.getRefType() + " " + event.getRefId());
        UUID userId = event.getUserId();
        ScoreEventType eventType = event.getEventType();
        LocalDate today = LocalDate.now();

        switch (eventType) {
            case PROBLEM_POSTED:
                // Milestone: increment problem count
                achievementService.incrementProgress(userId, MetricType.PROBLEMS_POSTED);
                // Streak: update problem posting streak
                achievementService.updateStreakProgress(userId,
                        MetricType.PROBLEM_POSTING_STREAK, today);
                // Activity streak
                achievementService.updateStreakProgress(userId, MetricType.ACTIVITY_STREAK,
                        today);
                break;

            case PROBLEM_ANSWER_ACCEPTED:
                // Milestone: increment accepted answers
                achievementService.incrementProgress(userId, MetricType.ACCEPTED_ANSWERS);
                // Activity streak
                achievementService.updateStreakProgress(userId, MetricType.ACTIVITY_STREAK, today);
                break;

            case SUBMISSION_ACCEPTED:
            case REVIEW_APPROVED:
                // Milestone: increment assignments completed
                achievementService.incrementProgress(userId, MetricType.ASSIGNMENTS_COMPLETED);
                // Streak: update assignment streak
                achievementService.updateStreakProgress(userId, MetricType.ASSIGNMENT_STREAK, today);
                // Activity streak
                achievementService.updateStreakProgress(userId, MetricType.ACTIVITY_STREAK, today);
                break;

            case COMMENT_CREATED:
                // Milestone: increment comments posted
                achievementService.incrementProgress(userId, MetricType.COMMENTS_POSTED);
                // Activity streak
                achievementService.updateStreakProgress(userId, MetricType.ACTIVITY_STREAK, today);
                break;

            default:
                // For other events, just update activity streak
                achievementService.updateStreakProgress(userId, MetricType.ACTIVITY_STREAK, today);
                break;
        }
    }
}
