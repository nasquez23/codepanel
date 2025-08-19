package com.codepanel.controllers;

import com.codepanel.models.User;
import com.codepanel.models.dto.AssignmentResponse;
import com.codepanel.models.dto.AssignmentSubmissionResponse;
import com.codepanel.models.dto.CreateAssignmentRequest;
import com.codepanel.models.dto.CreateSubmissionRequest;
import com.codepanel.models.dto.UpdateAssignmentRequest;
import com.codepanel.services.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody CreateAssignmentRequest request,
            @AuthenticationPrincipal User currentUser) {
        AssignmentResponse response = assignmentService.createAssignment(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<AssignmentResponse>> getAllAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @AuthenticationPrincipal(errorOnInvalidType = false) User currentUser) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<AssignmentResponse> response = assignmentService.getAllAssignments(pageable, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<AssignmentResponse>> getMyAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignmentResponse> response = assignmentService.getMyAssignments(currentUser, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponse> getAssignment(
            @PathVariable UUID id,
            @AuthenticationPrincipal(errorOnInvalidType = false) User currentUser) {
        AssignmentResponse response = assignmentService.getAssignmentById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssignmentRequest request,
            @AuthenticationPrincipal User currentUser) {
        AssignmentResponse response = assignmentService.updateAssignment(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        assignmentService.deleteAssignment(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<AssignmentSubmissionResponse> submitAssignment(
            @PathVariable UUID id,
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal User currentUser) {
        AssignmentSubmissionResponse response = assignmentService.submitAssignment(id, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<Page<AssignmentSubmissionResponse>> getSubmissions(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignmentSubmissionResponse> response = assignmentService.getSubmissionsForAssignment(id, currentUser, pageable);
        return ResponseEntity.ok(response);
    }
}
