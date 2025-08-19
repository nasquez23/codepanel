package com.codepanel.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.codepanel.models.AssignmentSubmission;
import com.codepanel.models.SubmissionReview;
import com.codepanel.models.User;

public interface SubmissionReviewRepository extends JpaRepository<SubmissionReview, UUID> {
    
    /**
     * Find review by submission
     */
    Optional<SubmissionReview> findByAssignmentSubmission(AssignmentSubmission submission);
    
    /**
     * Find reviews by reviewer
     */
    Page<SubmissionReview> findByReviewerOrderByCreatedAtDesc(User reviewer, Pageable pageable);
    
    /**
     * Check if submission has been reviewed
     */
    boolean existsByAssignmentSubmission(AssignmentSubmission submission);
}

