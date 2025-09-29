package com.codepanel.services;

import java.time.DayOfWeek;

import com.codepanel.models.Achievement;
import com.codepanel.models.User;
import com.codepanel.models.UserAchievement;
import com.codepanel.models.UserAchievementProgress;
import com.codepanel.models.enums.MetricType;
import com.codepanel.models.events.AchievementAwardedEvent;
import com.codepanel.repositories.AchievementRepository;
import com.codepanel.repositories.ScoreEventRepository;
import com.codepanel.repositories.UserAchievementProgressRepository;
import com.codepanel.repositories.UserScoreRepository;
import com.codepanel.repositories.UserAchievementRepository;
import com.codepanel.repositories.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.codepanel.models.ScoreEvent;
import com.codepanel.models.UserScore;
import com.codepanel.models.enums.ScoreEventType;

@Service
@Slf4j
@Transactional
public class AchievementService {
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserAchievementProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final UserScoreRepository userScoreRepository;
    private final ScoreEventRepository scoreEventRepository;
    private final NotificationEventPublisher notificationEventPublisher;
    private final ObjectMapper objectMapper;

    public AchievementService(AchievementRepository achievementRepository,
                             UserAchievementRepository userAchievementRepository,
                             UserAchievementProgressRepository progressRepository,
                             UserRepository userRepository,
                             UserScoreRepository userScoreRepository,
                             ScoreEventRepository scoreEventRepository,
                             NotificationEventPublisher notificationEventPublisher,
                             ObjectMapper objectMapper) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.userScoreRepository = userScoreRepository;
        this.scoreEventRepository = scoreEventRepository;
        this.notificationEventPublisher = notificationEventPublisher;
        this.objectMapper = objectMapper;
    }

    public void updateProgress(UUID userId, MetricType metricType, Integer newValue) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAchievementProgress progress = progressRepository
                .findByUserIdAndMetricType(userId, metricType)
                .orElse(new UserAchievementProgress());

        if (progress.getId() == null) {
            progress.setUser(user);
            progress.setMetricType(metricType);
            progress.setCurrentValue(0);
        }

        progress.setCurrentValue(newValue);
        progress.setLastUpdated(LocalDate.now());
        progressRepository.save(progress);

        // Check for new achievements
        checkAndAwardAchievements(user, metricType, newValue);
    }

    public void incrementProgress(UUID userId, MetricType metricType) {
        incrementProgress(userId, metricType, 1);
    }

    public void incrementProgress(UUID userId, MetricType metricType, Integer increment) {
        UserAchievementProgress progress = progressRepository
                .findByUserIdAndMetricType(userId, metricType)
                .orElse(null);

        Integer currentValue = progress != null ? progress.getCurrentValue() : 0;
        updateProgress(userId, metricType, currentValue + increment);
    }

    public void updateStreakProgress(UUID userId, MetricType metricType, LocalDate actionDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAchievementProgress progress = progressRepository
                .findByUserIdAndMetricType(userId, metricType)
                .orElse(new UserAchievementProgress());

        if (progress.getId() == null) {
            progress.setUser(user);
            progress.setMetricType(metricType);
            progress.setCurrentValue(1);
            progress.setStreakData(createStreakData(actionDate, actionDate));
        } else {
            // Calculate new streak
            LocalDate lastActionDate = getLastActionDate(progress.getStreakData());
            if (lastActionDate != null && actionDate.equals(lastActionDate.plusDays(1))) {
                // Continue streak
                progress.setCurrentValue(progress.getCurrentValue() + 1);
            } else if (lastActionDate != null && actionDate.equals(lastActionDate)) {
                // Same day, no change to streak
                return;
            } else {
                // Reset streak
                progress.setCurrentValue(1);
            }
            progress.setStreakData(updateStreakData(progress.getStreakData(), actionDate));
        }

        progress.setLastUpdated(actionDate);
        progressRepository.save(progress);

        // Check for new achievements
        checkAndAwardAchievements(user, metricType, progress.getCurrentValue());
    }

    public void resetStreak(UUID userId, MetricType metricType) {
        Optional<UserAchievementProgress> progressOpt = progressRepository
                .findByUserIdAndMetricType(userId, metricType);

        if (progressOpt.isPresent()) {
            UserAchievementProgress progress = progressOpt.get();
            progress.setCurrentValue(0);
            progress.setLastUpdated(LocalDate.now());
            progress.setStreakData(null);
            progressRepository.save(progress);
        }
    }

    @Transactional
    private void checkAndAwardAchievements(User user, MetricType metricType, Integer currentValue) {
        System.out.println("Checking and awarding achievements for user: " + user.getEmail() + " with metric type: " + metricType + " and current value: " + currentValue);
        List<Achievement> eligibleAchievements = achievementRepository
                .findEligibleAchievements(metricType, currentValue);
        System.out.println("Eligible achievements: " + eligibleAchievements.size());

        for (Achievement achievement : eligibleAchievements) {
            // Check if user already has this achievement
            if (!userAchievementRepository.existsByUserIdAndAchievementId(user.getId(), achievement.getId())) {
                // Award the achievement
                UserAchievement userAchievement = new UserAchievement();
                userAchievement.setUser(user);
                userAchievement.setAchievement(achievement);
                userAchievementRepository.save(userAchievement);

                System.out.println("Achievement awarded: " + achievement.getName() + " to user " + user.getUsername());

                // Send notification about new achievement
                try {
                    System.out.println("Publishing achievement awarded event for achievement: " + achievement.getName());
                    System.out.println("NotificationEventPublisher is null: " + (notificationEventPublisher == null));
                    
                    AchievementAwardedEvent event = AchievementAwardedEvent.builder()
                            .achievementId(achievement.getId())
                            .achievementName(achievement.getName())
                            .achievementDescription(achievement.getDescription())
                            .userId(user.getId())
                            .userName(user.getFirstName() + " " + user.getLastName())
                            .pointsReward(achievement.getPointsReward())
                            .awardedAt(LocalDateTime.now())
                            .build();

                    System.out.println("Built event: " + event);
                    notificationEventPublisher.publishAchievementAwarded(event);
                    System.out.println("Successfully published achievement awarded event for user: " + user.getEmail());
                } catch (Exception e) {
                    System.out.println("Failed to publish achievement awarded event: " + e.getMessage());
                    e.printStackTrace();
                }
                
                LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
                UserScore score = userScoreRepository.findByUserAndWeekStart(user, weekStart);
                if (score == null) {
                    score = new UserScore();
                    score.setUser(user);
                    score.setWeekStart(weekStart);
                    score.setPoints(0);
                }
                score.setPoints(score.getPoints() + achievement.getPointsReward());

                userScoreRepository.save(score);

                ScoreEvent scoreEvent = new ScoreEvent();
                scoreEvent.setUser(user);
                scoreEvent.setEventType(ScoreEventType.ACHIEVEMENT_AWARDED);
                scoreEvent.setPoints(achievement.getPointsReward());
                scoreEvent.setRefType("ACHIEVEMENT_AWARDED");
                scoreEvent.setRefId(achievement.getId());
                scoreEventRepository.save(scoreEvent);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<UserAchievement> getUserAchievements(UUID userId) {
        return userAchievementRepository.findByUserIdWithAchievement(userId);
    }

    @Transactional(readOnly = true)
    public List<UserAchievementProgress> getUserProgress(UUID userId) {
        return progressRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    private JsonNode createStreakData(LocalDate firstDate, LocalDate lastDate) {
        ObjectNode streakData = objectMapper.createObjectNode();
        streakData.put("firstActionDate", firstDate.toString());
        streakData.put("lastActionDate", lastDate.toString());
        return streakData;
    }

    private JsonNode updateStreakData(JsonNode existingData, LocalDate newActionDate) {
        ObjectNode streakData = (ObjectNode) existingData;
        if (streakData == null) {
            return createStreakData(newActionDate, newActionDate);
        }
        streakData.put("lastActionDate", newActionDate.toString());
        return streakData;
    }

    private LocalDate getLastActionDate(JsonNode streakData) {
        if (streakData == null || !streakData.has("lastActionDate")) {
            return null;
        }
        return LocalDate.parse(streakData.get("lastActionDate").asText());
    }

    /**
     * Get all achievements with user's progress and earned status
     * This combines all achievements with the user's progress and earned achievements
     */
    public List<AchievementWithProgress> getAllAchievementsWithUserProgress(UUID userId) {
        // Get all achievements
        List<Achievement> allAchievements = achievementRepository.findAll();
        
        // Get user's earned achievements
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserIdWithAchievement(userId);
        
        // Get user's progress
        List<UserAchievementProgress> userProgress = progressRepository.findByUserId(userId);
        
        // Create maps for quick lookup
        Map<UUID, UserAchievement> earnedMap = userAchievements.stream()
                .collect(Collectors.toMap(
                        ua -> ua.getAchievement().getId(),
                        ua -> ua));
        
        Map<MetricType, UserAchievementProgress> progressMap = userProgress.stream()
                .collect(Collectors.toMap(
                        UserAchievementProgress::getMetricType,
                        progress -> progress));
        
        // Combine all achievements with user data
        return allAchievements.stream()
                .map(achievement -> {
                    AchievementWithProgress result = new AchievementWithProgress();
                    result.setAchievement(achievement);
                    
                    // Check if user has earned this achievement
                    UserAchievement earned = earnedMap.get(achievement.getId());
                    if (earned != null) {
                        result.setEarnedAt(earned.getCreatedAt().toString());
                    }
                    
                    // Get user's progress for this achievement's metric type
                    UserAchievementProgress progress = progressMap.get(achievement.getMetricType());
                    if (progress != null) {
                        result.setCurrentProgress(progress.getCurrentValue());
                    } else {
                        result.setCurrentProgress(0);
                    }
                    
                    return result;
                })
                .collect(Collectors.toList());
    }

    // Inner class to hold achievement with progress data
    public static class AchievementWithProgress {
        private Achievement achievement;
        private String earnedAt;
        private Integer currentProgress;

        // Getters and setters
        public Achievement getAchievement() { return achievement; }
        public void setAchievement(Achievement achievement) { this.achievement = achievement; }
        
        public String getEarnedAt() { return earnedAt; }
        public void setEarnedAt(String earnedAt) { this.earnedAt = earnedAt; }
        
        public Integer getCurrentProgress() { return currentProgress; }
        public void setCurrentProgress(Integer currentProgress) { this.currentProgress = currentProgress; }
    }
}
