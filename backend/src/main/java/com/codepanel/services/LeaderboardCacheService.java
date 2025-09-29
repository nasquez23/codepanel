package com.codepanel.services;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Set;

@Service
public class LeaderboardCacheService {
    private final StringRedisTemplate redis;

    public LeaderboardCacheService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    private String weeklyKey(LocalDate monday) {
        return "lb:weekly:" + monday.toString();
    }

    private String monthlyKey(YearMonth month) {
        return "lb:monthly:" + month.toString();
    }

    private String allTimeKey() {
        return "lb:alltime";
    }

    public void incrementWeekly(String userId, double points, LocalDate weekStart) {
        try {
            String key = weeklyKey(weekStart);
            redis.opsForZSet().incrementScore(key, userId, points);
        } catch (Exception e) {
            System.out.println("Failed to update weekly leaderboard cache (Redis unavailable): " + e.getMessage());
        }
    }

    public void incrementMonthly(String userId, double points, YearMonth month) {
        try {
            String key = monthlyKey(month);
            redis.opsForZSet().incrementScore(key, userId, points);
        } catch (Exception e) {
            System.out.println("Failed to update monthly leaderboard cache (Redis unavailable): " + e.getMessage());
        }
    }

    public void incrementAllTime(String userId, double points) {
        try {
            String key = allTimeKey();
            redis.opsForZSet().incrementScore(key, userId, points);
        } catch (Exception e) {
            System.out.println("Failed to update all-time leaderboard cache (Redis unavailable): " + e.getMessage());
        }
    }

    public Set<String> topWeekly(LocalDate weekStart, long start, long end) {
        String key = weeklyKey(weekStart);
        return redis.opsForZSet().reverseRange(key, start, end);
    }

    public Set<String> topMonthly(YearMonth month, long start, long end) {
        String key = monthlyKey(month);
        return redis.opsForZSet().reverseRange(key, start, end);
    }

    public Set<String> topAllTime(long start, long end) {
        String key = allTimeKey();
        return redis.opsForZSet().reverseRange(key, start, end);
    }
}
