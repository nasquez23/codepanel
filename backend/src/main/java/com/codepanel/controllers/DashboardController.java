
package com.codepanel.controllers;

import com.codepanel.models.User;
import com.codepanel.models.dto.StudentStatsResponse;
import com.codepanel.services.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/me/student")
    public ResponseEntity<StudentStatsResponse> getMyStudentStats(
            @AuthenticationPrincipal User currentUser) {
        StudentStatsResponse resp = dashboardService.getStudentStats(currentUser);
        return ResponseEntity.ok(resp);
    }
}
