package com.codepanel.controllers;

import com.codepanel.models.UserScore;
import com.codepanel.models.dto.LeaderboardEntryResponse;
import com.codepanel.services.GamificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    private final GamificationService gamificationService;

    public LeaderboardController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @GetMapping("/weekly")
    public ResponseEntity<Page<LeaderboardEntryResponse>> weekly(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserScore> raw = gamificationService.getWeeklyLeaderboard(weekStart, page, size);
        List<LeaderboardEntryResponse> mapped = raw.getContent().stream().map(us -> {
            LeaderboardEntryResponse.UserInfo u = new LeaderboardEntryResponse.UserInfo(
                    us.getUser().getId().toString(),
                    us.getUser().getFirstName(),
                    us.getUser().getLastName(),
                    us.getUser().getProfilePictureUrl()
            );
            return new LeaderboardEntryResponse(
                    us.getId().toString(),
                    u,
                    us.getWeekStart().toString(),
                    us.getPoints()
            );
        }).toList();
        Page<LeaderboardEntryResponse> response = new PageImpl<>(mapped, PageRequest.of(page, size), raw.getTotalElements());
        return ResponseEntity.ok(response);
    }
}


