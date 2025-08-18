package com.codepanel.controllers;

import com.codepanel.models.User;
import com.codepanel.models.dto.CommentResponse;
import com.codepanel.models.dto.CreateCommentRequest;
import com.codepanel.models.dto.UpdateCommentRequest;
import com.codepanel.services.CommentService;
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
@RequestMapping("/api/problem-posts/{problemPostId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable UUID problemPostId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse response = commentService.createComment(problemPostId, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<CommentResponse>> getComments(
            @PathVariable UUID problemPostId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<CommentResponse> response = commentService.getCommentsByProblemPost(problemPostId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponse> getComment(@PathVariable UUID commentId) {
        CommentResponse response = commentService.getCommentById(commentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable UUID problemPostId,
            @PathVariable UUID commentId,
            @Valid @RequestBody UpdateCommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse response = commentService.updateComment(commentId, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID problemPostId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User currentUser) {
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<CommentResponse> likeComment(
            @PathVariable UUID problemPostId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse response = commentService.likeComment(commentId, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{commentId}/dislike")
    public ResponseEntity<CommentResponse> dislikeComment(
            @PathVariable UUID problemPostId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse response = commentService.dislikeComment(commentId, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCommentCount(@PathVariable UUID problemPostId) {
        Long count = commentService.getCommentCount(problemPostId);
        return ResponseEntity.ok(count);
    }
}

// Additional controller for user's comments
@RestController
@RequestMapping("/api/my-comments")
class MyCommentsController {

    private final CommentService commentService;

    public MyCommentsController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<Page<CommentResponse>> getMyComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<CommentResponse> response = commentService.getCommentsByUser(currentUser, pageable);
        return ResponseEntity.ok(response);
    }
}
