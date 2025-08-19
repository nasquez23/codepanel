package com.codepanel.controllers;

import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.codepanel.models.User;
import com.codepanel.models.dto.AssignmentSubmissionResponse;
import com.codepanel.models.dto.CreateReviewRequest;
import com.codepanel.services.AssignmentService;

@RestController
@RequestMapping("/api/submissions")
class SubmissionController {

    private final AssignmentService assignmentService;

    public SubmissionController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/my")
    public ResponseEntity<Page<AssignmentSubmissionResponse>> getMySubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignmentSubmissionResponse> response = assignmentService.getMySubmissions(currentUser, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentSubmissionResponse> getSubmission(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        AssignmentSubmissionResponse response = assignmentService.getSubmissionById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<AssignmentSubmissionResponse> reviewSubmission(
            @PathVariable UUID id,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal User currentUser) {
        AssignmentSubmissionResponse response = assignmentService.reviewSubmission(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-reviews")
    public ResponseEntity<Page<AssignmentSubmissionResponse>> getPendingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignmentSubmissionResponse> response = assignmentService.getPendingReviews(currentUser, pageable);
        return ResponseEntity.ok(response);
    }
}