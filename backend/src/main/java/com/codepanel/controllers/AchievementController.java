package com.codepanel.controllers;

import com.codepanel.models.Achievement;
import com.codepanel.models.User;
import com.codepanel.models.UserAchievement;
import com.codepanel.models.UserAchievementProgress;
import com.codepanel.models.dto.AchievementResponse;
import com.codepanel.models.dto.AchievementWithProgressResponse;
import com.codepanel.models.dto.UserAchievementProgressResponse;
import com.codepanel.models.enums.MetricType;
import com.codepanel.services.AchievementService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getAllAchievements() {
        try {
        List<Achievement> achievements = achievementService.getAllAchievements();
        List<AchievementResponse> response = achievements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error getting all achievements: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AchievementResponse>> getUserAchievements(@PathVariable UUID userId) {
        List<Achievement> allAchievements = achievementService.getAllAchievements();
        List<UserAchievement> userAchievements = achievementService.getUserAchievements(userId);

        Map<UUID, UserAchievement> earnedMap = userAchievements.stream()
                .collect(Collectors.toMap(
                        ua -> ua.getAchievement().getId(),
                        ua -> ua));

        List<AchievementResponse> response = allAchievements.stream()
                .map(achievement -> {
                    AchievementResponse resp = mapToResponse(achievement);
                    UserAchievement earned = earnedMap.get(achievement.getId());
                    if (earned != null) {
                        resp.setEarnedAt(earned.getCreatedAt());
                    }
                    return resp;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<AchievementResponse>> getMyAchievements(@AuthenticationPrincipal User currentUser) {
        List<UserAchievement> userAchievements = achievementService.getUserAchievements(currentUser.getId());
        List<AchievementResponse> response = userAchievements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<List<UserAchievementProgressResponse>> getUserProgress(@PathVariable UUID userId) {
        List<UserAchievementProgress> progress = achievementService.getUserProgress(userId);
        List<UserAchievementProgressResponse> response = progress.stream()
                .map(this::mapProgressToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/progress/me")
    public ResponseEntity<List<UserAchievementProgressResponse>> getMyProgress(
            @AuthenticationPrincipal User currentUser) {
        List<UserAchievementProgress> progress = achievementService.getUserProgress(currentUser.getId());
        List<UserAchievementProgressResponse> response = progress.stream()
                .map(this::mapProgressToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/with-progress/me")
    public ResponseEntity<List<AchievementWithProgressResponse>> getMyAchievementsWithProgress(
            @AuthenticationPrincipal User currentUser) {
        List<AchievementService.AchievementWithProgress> achievementsWithProgress = 
                achievementService.getAllAchievementsWithUserProgress(currentUser.getId());
        
        List<AchievementWithProgressResponse> response = achievementsWithProgress.stream()
                .map(this::mapToAchievementWithProgressResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    private AchievementResponse mapToResponse(Achievement achievement) {
        AchievementResponse response = new AchievementResponse();
        response.setId(achievement.getId());
        response.setName(achievement.getName());
        response.setDescription(achievement.getDescription());
        response.setIcon(achievement.getIcon());
        response.setCategory(achievement.getCategory());
        response.setMetricType(achievement.getMetricType());
        response.setTargetValue(achievement.getTargetValue());
        response.setPointsReward(achievement.getPointsReward());
        return response;
    }

    private AchievementResponse mapToResponse(UserAchievement userAchievement) {
        AchievementResponse response = new AchievementResponse();
        response.setId(userAchievement.getAchievement().getId());
        response.setName(userAchievement.getAchievement().getName());
        response.setDescription(userAchievement.getAchievement().getDescription());
        response.setIcon(userAchievement.getAchievement().getIcon());
        response.setCategory(userAchievement.getAchievement().getCategory());
        response.setMetricType(userAchievement.getAchievement().getMetricType());
        response.setTargetValue(userAchievement.getAchievement().getTargetValue());
        response.setPointsReward(userAchievement.getAchievement().getPointsReward());
        return response;
    }

    private UserAchievementProgressResponse mapProgressToResponse(UserAchievementProgress progress) {
        return new UserAchievementProgressResponse(
                progress.getMetricType(),
                progress.getCurrentValue(),
                progress.getLastUpdated(),
                getDisplayName(progress.getMetricType()));
    }

    private AchievementWithProgressResponse mapToAchievementWithProgressResponse(
            AchievementService.AchievementWithProgress achievementWithProgress) {
        Achievement achievement = achievementWithProgress.getAchievement();
        
        AchievementWithProgressResponse response = new AchievementWithProgressResponse();
        response.setId(achievement.getId());
        response.setName(achievement.getName());
        response.setDescription(achievement.getDescription());
        response.setIcon(achievement.getIcon());
        response.setCategory(achievement.getCategory());
        response.setMetricType(achievement.getMetricType());
        response.setTargetValue(achievement.getTargetValue());
        response.setPointsReward(achievement.getPointsReward());
        response.setEarnedAt(achievementWithProgress.getEarnedAt());
        response.setCurrentProgress(achievementWithProgress.getCurrentProgress());
        
        return response;
    }

    private String getDisplayName(MetricType metricType) {
        switch (metricType) {
            case PROBLEMS_POSTED:
                return "Problems Posted";
            case COMMENTS_POSTED:
                return "Comments Posted";
            case ACCEPTED_ANSWERS:
                return "Accepted Answers";
            case ASSIGNMENTS_COMPLETED:
                return "Assignments Completed";
            case TOTAL_POINTS:
                return "Total Points";
            case TOTAL_LIKES_RECEIVED:
                return "Total Likes Received";
            case PROBLEM_POSTING_STREAK:
                return "Problem Posting Streak";
            case ASSIGNMENT_STREAK:
                return "Assignment Streak";
            case ACTIVITY_STREAK:
                return "Activity Streak";
            default:
                return metricType.toString();
        }
    }
}
