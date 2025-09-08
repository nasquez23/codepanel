package com.codepanel.services;

import com.codepanel.models.Achievement;
import com.codepanel.models.User;
import com.codepanel.models.UserAchievement;
import com.codepanel.models.UserAchievementProgress;
import com.codepanel.models.enums.MetricType;
import com.codepanel.repositories.AchievementRepository;
import com.codepanel.repositories.UserAchievementProgressRepository;
import com.codepanel.repositories.UserAchievementRepository;
import com.codepanel.repositories.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AchievementService {
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserAchievementProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

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

    private void checkAndAwardAchievements(User user, MetricType metricType, Integer currentValue) {
        List<Achievement> eligibleAchievements = achievementRepository
                .findEligibleAchievements(metricType, currentValue);

        for (Achievement achievement : eligibleAchievements) {
            // Check if user already has this achievement
            if (!userAchievementRepository.existsByUserIdAndAchievementId(user.getId(), achievement.getId())) {
                // Award the achievement
                UserAchievement userAchievement = new UserAchievement();
                userAchievement.setUser(user);
                userAchievement.setAchievement(achievement);
                userAchievementRepository.save(userAchievement);

                System.out.println("Achievement awarded: " + achievement.getName() + " to user " + user.getUsername());

                // TODO: Send notification about new achievement
                // TODO: Award points if applicable
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
}
