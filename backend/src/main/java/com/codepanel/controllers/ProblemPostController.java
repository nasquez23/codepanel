package com.codepanel.controllers;


import com.codepanel.models.User;
import com.codepanel.models.dto.CreateProblemPostRequest;
import com.codepanel.models.dto.UpdateProblemPostRequest;
import com.codepanel.models.dto.ProblemPostResponse;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;

import java.util.List;
import com.codepanel.services.ProblemPostService;
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
@RequestMapping("/api/problem-posts")
public class ProblemPostController {

    private final ProblemPostService problemPostService;

    public ProblemPostController(ProblemPostService problemPostService) {
        this.problemPostService = problemPostService;
    }

    @PostMapping
    public ResponseEntity<ProblemPostResponse> createProblemPost(
            @Valid @RequestBody CreateProblemPostRequest request,
            @AuthenticationPrincipal User currentUser) {
        ProblemPostResponse response = problemPostService.createProblemPost(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProblemPostResponse>> getAllProblemPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<ProblemPostResponse> response = problemPostService.getAllProblemPosts(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemPostResponse> getProblemPostById(@PathVariable UUID id) {
        ProblemPostResponse response = problemPostService.getProblemPostById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-posts")
    public ResponseEntity<Page<ProblemPostResponse>> getMyProblemPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ProblemPostResponse> response = problemPostService.getProblemPostsByUser(currentUser, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProblemPostResponse>> searchProblemPosts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ProgrammingLanguage language,
            @RequestParam(required = false) DifficultyLevel difficulty,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) List<UUID> tagIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<ProblemPostResponse> response = problemPostService.searchProblemPosts(
            query, language, difficulty, categoryId, tagIds, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProblemPostResponse> updateProblemPost(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProblemPostRequest request,
            @AuthenticationPrincipal User currentUser) {
        ProblemPostResponse response = problemPostService.updateProblemPost(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblemPost(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        problemPostService.deleteProblemPost(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}