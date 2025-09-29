package com.codepanel.services;

import com.codepanel.config.GamificationRabbitConfig;
import com.codepanel.models.User;
import com.codepanel.models.dto.GamificationEvent;
import com.codepanel.models.enums.MetricType;
import com.codepanel.repositories.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class GamificationEventListener {
    private final GamificationService gamificationService;
    private final UserRepository userRepository;
    private final AchievementService achievementService;

    public GamificationEventListener(GamificationService gamificationService,
            UserRepository userRepository, AchievementService achievementService) {
        this.gamificationService = gamificationService;
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    @RabbitListener(queues = GamificationRabbitConfig.QUEUE)
    public void onEvent(GamificationEvent event) {
        try {
            System.out.println("=== GAMIFICATION EVENT RECEIVED ===");
            System.out.println("Event details: " + event.getEventType() + " " + event.getUserId() + " "
                    + event.getDifficulty() + " " + event.getRefType() + " " + event.getRefId());

            User user = userRepository.findById(event.getUserId()).orElse(null);
            if (user == null) {
                System.out.println("User not found for gamification event: " + event.getUserId());
                return;
            }

            int basePoints = switch (event.getEventType()) {
                case SUBMISSION_ACCEPTED -> 10;
                case REVIEW_APPROVED -> 5;
                case PROBLEM_ACCEPTED -> 0;
                case COMMENT_CREATED -> 1;
                case COMMENT_LIKED -> 2;
                case COMMENT_DISLIKED -> -2;
                case PROBLEM_ANSWER_ACCEPTED -> 10;
                case PROBLEM_ANSWER_UNACCEPTED -> -10;
                case PROBLEM_POSTED -> 0;
                case ACHIEVEMENT_AWARDED -> 0;
            };

            gamificationService.recordEvent(
                    user,
                    event.getEventType(),
                    event.getDifficulty(),
                    basePoints,
                    event.getRefType(),
                    event.getRefId());

            System.out.println("Gamification event recorded: " + event.getEventType());

            // Also handle achievement progress for the same event
            handleAchievementProgress(event);

            System.out.println("=== GAMIFICATION EVENT PROCESSING COMPLETE ===");
        } catch (Exception e) {
            System.out.println("ERROR processing gamification event: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to trigger RabbitMQ retry mechanisms
        }
    }

    private void handleAchievementProgress(GamificationEvent event) {
        System.out.println("=== HANDLING ACHIEVEMENT PROGRESS ===");
        System.out.println("Event details: " + event.getEventType() + " " + event.getUserId() + " "
                + event.getDifficulty() + " " + event.getRefType() + " " + event.getRefId());
        LocalDate today = LocalDate.now();

        switch (event.getEventType()) {
            case PROBLEM_POSTED:
                // Milestone: increment problem count
                achievementService.incrementProgress(event.getUserId(), MetricType.PROBLEMS_POSTED);
                // Streak: update problem posting streak
                achievementService.updateStreakProgress(event.getUserId(),
                        MetricType.PROBLEM_POSTING_STREAK, today);
                // Activity streak
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ACTIVITY_STREAK,
                        today);
                break;

            case COMMENT_CREATED:
                // Milestone: increment comments posted
                achievementService.incrementProgress(event.getUserId(), MetricType.COMMENTS_POSTED);
                // Activity streak
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ACTIVITY_STREAK, today);
                break;

            case COMMENT_LIKED:
                // Milestone: increment total likes received (event.getUserId() is already the
                // comment author)
                achievementService.incrementProgress(event.getUserId(), MetricType.TOTAL_LIKES_RECEIVED);
                // Activity streak for the comment author
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ACTIVITY_STREAK, today);
                break;

            case PROBLEM_ANSWER_ACCEPTED:
                // Milestone: increment accepted answers
                achievementService.incrementProgress(event.getUserId(), MetricType.ACCEPTED_ANSWERS);
                // Activity streak
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ACTIVITY_STREAK, today);
                break;

            case SUBMISSION_ACCEPTED:
            case REVIEW_APPROVED:
                // Milestone: increment assignments completed
                achievementService.incrementProgress(event.getUserId(), MetricType.ASSIGNMENTS_COMPLETED);
                // Streak: update assignment streak
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ASSIGNMENT_STREAK, today);
                // Activity streak
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ACTIVITY_STREAK, today);
                break;

            case COMMENT_DISLIKED:
            case PROBLEM_ANSWER_UNACCEPTED:
            case ACHIEVEMENT_AWARDED:
                break;

            default:
                // For any other events, just update activity streak
                achievementService.updateStreakProgress(event.getUserId(), MetricType.ACTIVITY_STREAK, today);
                break;
        }
    }
}
