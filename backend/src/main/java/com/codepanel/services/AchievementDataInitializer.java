package com.codepanel.services;

import com.codepanel.models.Achievement;
import com.codepanel.models.enums.AchievementCategory;
import com.codepanel.models.enums.MetricType;
import com.codepanel.repositories.AchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class AchievementDataInitializer implements CommandLineRunner {
    private final AchievementRepository achievementRepository;

    public AchievementDataInitializer(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        if (achievementRepository.count() == 0) {
            initializeAchievements();
        }
    }
    
    private void initializeAchievements() {
        List<Achievement> achievements = Arrays.asList(
                // Milestone Achievements - Problems
                createAchievement("🎯", "First Problem", "Post your first problem", 
                        AchievementCategory.MILESTONE, MetricType.PROBLEMS_POSTED, 1, 10),
                createAchievement("📝", "Problem Creator", "Post 10 problems", 
                        AchievementCategory.MILESTONE, MetricType.PROBLEMS_POSTED, 10, 50),
                createAchievement("🏗️", "Problem Builder", "Post 25 problems", 
                        AchievementCategory.MILESTONE, MetricType.PROBLEMS_POSTED, 25, 100),
                createAchievement("🎨", "Problem Architect", "Post 50 problems", 
                        AchievementCategory.MILESTONE, MetricType.PROBLEMS_POSTED, 50, 200),
                createAchievement("🚀", "Problem Master", "Post 100 problems", 
                        AchievementCategory.MILESTONE, MetricType.PROBLEMS_POSTED, 100, 500),
                
                // Milestone Achievements - Comments/Answers
                createAchievement("💬", "First Helper", "Post your first comment", 
                        AchievementCategory.MILESTONE, MetricType.COMMENTS_POSTED, 1, 5),
                createAchievement("🤝", "Helper", "Post 25 comments", 
                        AchievementCategory.MILESTONE, MetricType.COMMENTS_POSTED, 25, 50),
                createAchievement("🎓", "Mentor", "Post 50 comments", 
                        AchievementCategory.MILESTONE, MetricType.COMMENTS_POSTED, 50, 100),
                createAchievement("🧠", "Guru", "Post 100 comments", 
                        AchievementCategory.MILESTONE, MetricType.COMMENTS_POSTED, 100, 200),
                createAchievement("⭐", "Legend", "Post 250 comments", 
                        AchievementCategory.MILESTONE, MetricType.COMMENTS_POSTED, 250, 500),
                
                // Milestone Achievements - Accepted Answers
                createAchievement("✅", "Solution Finder", "Get 5 accepted answers", 
                        AchievementCategory.MILESTONE, MetricType.ACCEPTED_ANSWERS, 5, 50),
                createAchievement("🎯", "Solution Expert", "Get 15 accepted answers", 
                        AchievementCategory.MILESTONE, MetricType.ACCEPTED_ANSWERS, 15, 150),
                createAchievement("🏆", "Solution Master", "Get 30 accepted answers", 
                        AchievementCategory.MILESTONE, MetricType.ACCEPTED_ANSWERS, 30, 300),
                createAchievement("👑", "Solution King", "Get 50 accepted answers", 
                        AchievementCategory.MILESTONE, MetricType.ACCEPTED_ANSWERS, 50, 500),
                
                // Milestone Achievements - Assignments
                createAchievement("📚", "Student", "Complete 5 assignments", 
                        AchievementCategory.MILESTONE, MetricType.ASSIGNMENTS_COMPLETED, 5, 25),
                createAchievement("🎒", "Scholar", "Complete 15 assignments", 
                        AchievementCategory.MILESTONE, MetricType.ASSIGNMENTS_COMPLETED, 15, 75),
                createAchievement("🎓", "Graduate", "Complete 30 assignments", 
                        AchievementCategory.MILESTONE, MetricType.ASSIGNMENTS_COMPLETED, 30, 150),
                createAchievement("🏅", "Overachiever", "Complete 50 assignments", 
                        AchievementCategory.MILESTONE, MetricType.ASSIGNMENTS_COMPLETED, 50, 250),
                
                // Milestone Achievements - Points
                createAchievement("💯", "Point Collector", "Earn 100 total points", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_POINTS, 100, 20),
                createAchievement("💰", "Point Earner", "Earn 500 total points", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_POINTS, 500, 50),
                createAchievement("💎", "Point Master", "Earn 1000 total points", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_POINTS, 1000, 100),
                createAchievement("🌟", "Point Legend", "Earn 2500 total points", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_POINTS, 2500, 200),
                createAchievement("👑", "Point King", "Earn 5000 total points", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_POINTS, 5000, 500),
                
                // Milestone Achievements - Likes
                createAchievement("👍", "Liked", "Receive 50 total likes", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_LIKES_RECEIVED, 50, 25),
                createAchievement("❤️", "Well Liked", "Receive 100 total likes", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_LIKES_RECEIVED, 100, 50),
                createAchievement("🌟", "Popular", "Receive 250 total likes", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_LIKES_RECEIVED, 250, 100),
                createAchievement("🔥", "Famous", "Receive 500 total likes", 
                        AchievementCategory.MILESTONE, MetricType.TOTAL_LIKES_RECEIVED, 500, 200),
                
                // Streak Achievements - Problem Posting
                createAchievement("🎯", "Problem Streak", "Post problems for 3 consecutive days", 
                        AchievementCategory.STREAK, MetricType.PROBLEM_POSTING_STREAK, 3, 25),
                createAchievement("📝", "Problem Marathon", "Post problems for 7 consecutive days", 
                        AchievementCategory.STREAK, MetricType.PROBLEM_POSTING_STREAK, 7, 75),
                createAchievement("🚀", "Problem Machine", "Post problems for 14 consecutive days", 
                        AchievementCategory.STREAK, MetricType.PROBLEM_POSTING_STREAK, 14, 150),
                
                // Streak Achievements - Assignment Completion
                createAchievement("📚", "Study Streak", "Complete assignments for 3 consecutive days", 
                        AchievementCategory.STREAK, MetricType.ASSIGNMENT_STREAK, 3, 25),
                createAchievement("🎓", "Study Marathon", "Complete assignments for 7 consecutive days", 
                        AchievementCategory.STREAK, MetricType.ASSIGNMENT_STREAK, 7, 75),
                createAchievement("🏅", "Study Machine", "Complete assignments for 14 consecutive days", 
                        AchievementCategory.STREAK, MetricType.ASSIGNMENT_STREAK, 14, 150),
                
                // Streak Achievements - General Activity
                createAchievement("🔥", "Active Streak", "Be active for 7 consecutive days", 
                        AchievementCategory.STREAK, MetricType.ACTIVITY_STREAK, 7, 50),
                createAchievement("⚡", "Activity Marathon", "Be active for 14 consecutive days", 
                        AchievementCategory.STREAK, MetricType.ACTIVITY_STREAK, 14, 100),
                createAchievement("💪", "Activity Beast", "Be active for 30 consecutive days", 
                        AchievementCategory.STREAK, MetricType.ACTIVITY_STREAK, 30, 200)
        );
        
        achievementRepository.saveAll(achievements);
        System.out.println("Initialized " + achievements.size() + " achievements");
    }
    
    private Achievement createAchievement(String icon, String name, String description, 
                                        AchievementCategory category, MetricType metricType, 
                                        Integer targetValue, Integer pointsReward) {
        Achievement achievement = new Achievement();
        achievement.setIcon(icon);
        achievement.setName(name);
        achievement.setDescription(description);
        achievement.setCategory(category);
        achievement.setMetricType(metricType);
        achievement.setTargetValue(targetValue);
        achievement.setPointsReward(pointsReward);
        return achievement;
    }
}
