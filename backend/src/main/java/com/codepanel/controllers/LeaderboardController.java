package com.codepanel.controllers;

import com.codepanel.models.User;
import com.codepanel.models.UserScore;
import com.codepanel.models.dto.LeaderboardEntryResponse;
import com.codepanel.models.dto.LeaderboardResponse;
import com.codepanel.services.GamificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    private final GamificationService gamificationService;

    public LeaderboardController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @GetMapping("/weekly")
    public ResponseEntity<Page<LeaderboardEntryResponse>> weekly(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserScore> raw = gamificationService.getWeeklyLeaderboard(weekStart, page, size);
        List<LeaderboardEntryResponse> mapped = raw.getContent().stream().map(us -> {
            LeaderboardEntryResponse.UserInfo u = new LeaderboardEntryResponse.UserInfo(
                    us.getUser().getId().toString(),
                    us.getUser().getFirstName(),
                    us.getUser().getLastName(),
                    us.getUser().getProfilePictureUrl());
            return new LeaderboardEntryResponse(
                    us.getId().toString(),
                    u,
                    us.getWeekStart().toString(),
                    us.getPoints());
        }).toList();
        Page<LeaderboardEntryResponse> response = new PageImpl<>(mapped, PageRequest.of(page, size),
                raw.getTotalElements());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<LeaderboardResponse>> monthly(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") String month,
            @RequestParam(defaultValue = "25") int limit) {

        YearMonth targetMonth = null;
        if (month != null) {
            targetMonth = YearMonth.parse(month);
        }

        List<Object[]> rawResults = gamificationService.getMonthlyLeaderboard(targetMonth, limit);
        AtomicInteger rank = new AtomicInteger(1);

        List<LeaderboardResponse> mapped = rawResults.stream().map(result -> {
            User user = (User) result[0];
            Long points = (Long) result[1];

            LeaderboardResponse.UserInfo userInfo = new LeaderboardResponse.UserInfo(
                    user.getId().toString(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getProfilePictureUrl());

            return new LeaderboardResponse(userInfo, points.intValue(), rank.getAndIncrement());
        }).toList();

        return ResponseEntity.ok(mapped);
    }

    @GetMapping("/all-time")
    public ResponseEntity<List<LeaderboardResponse>> allTime(
            @RequestParam(defaultValue = "25") int limit) {

        List<Object[]> rawResults = gamificationService.getAllTimeLeaderboard(limit);
        AtomicInteger rank = new AtomicInteger(1);

        List<LeaderboardResponse> mapped = rawResults.stream().map(result -> {
            User user = (User) result[0];
            Long points = (Long) result[1];

            LeaderboardResponse.UserInfo userInfo = new LeaderboardResponse.UserInfo(
                    user.getId().toString(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getProfilePictureUrl());

            return new LeaderboardResponse(userInfo, points.intValue(), rank.getAndIncrement());
        }).toList();

        return ResponseEntity.ok(mapped);
    }
}
