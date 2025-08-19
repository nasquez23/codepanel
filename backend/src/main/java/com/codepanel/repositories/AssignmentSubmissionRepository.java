package com.codepanel.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codepanel.models.Assignment;
import com.codepanel.models.AssignmentSubmission;
import com.codepanel.models.User;
import com.codepanel.models.enums.SubmissionStatus;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, UUID> {
    
    /**
     * Find submission by assignment and student
     */
    Optional<AssignmentSubmission> findByAssignmentAndStudent(Assignment assignment, User student);
    
    /**
     * Find submission by ID with eager loading
     */
    @Query("SELECT s FROM AssignmentSubmission s " +
           "JOIN FETCH s.assignment a " +
           "JOIN FETCH a.instructor " +
           "JOIN FETCH s.student " +
           "LEFT JOIN FETCH s.review r " +
           "LEFT JOIN FETCH r.reviewer " +
           "WHERE s.id = :id")
    Optional<AssignmentSubmission> findByIdWithDetails(@Param("id") UUID id);
    
    /**
     * Find all submissions for an assignment with eager loading
     */
    @Query("SELECT s FROM AssignmentSubmission s " +
           "JOIN FETCH s.assignment a " +
           "JOIN FETCH a.instructor " +
           "JOIN FETCH s.student " +
           "WHERE s.assignment = :assignment " +
           "ORDER BY s.createdAt DESC")
    Page<AssignmentSubmission> findByAssignmentOrderByCreatedAtDesc(@Param("assignment") Assignment assignment, Pageable pageable);
    
    /**
     * Find submissions by student with eager loading
     */
    @Query("SELECT s FROM AssignmentSubmission s " +
           "JOIN FETCH s.assignment a " +
           "JOIN FETCH a.instructor " +
           "JOIN FETCH s.student " +
           "WHERE s.student = :student " +
           "ORDER BY s.createdAt DESC")
    Page<AssignmentSubmission> findByStudentOrderByCreatedAtDesc(@Param("student") User student, Pageable pageable);
    
    /**
     * Find submissions by status
     */
    Page<AssignmentSubmission> findByStatusOrderByCreatedAtAsc(SubmissionStatus status, Pageable pageable);
    
    /**
     * Find submissions for assignments created by an instructor with eager loading
     */
    @Query("SELECT s FROM AssignmentSubmission s " +
           "JOIN FETCH s.assignment a " +
           "JOIN FETCH a.instructor " +
           "JOIN FETCH s.student " +
           "WHERE a.instructor.id = :instructorId " +
           "ORDER BY s.createdAt DESC")
    Page<AssignmentSubmission> findByInstructorId(@Param("instructorId") UUID instructorId, Pageable pageable);
    
    /**
     * Find pending review submissions for assignments created by an instructor with eager loading
     */
    @Query("SELECT s FROM AssignmentSubmission s " +
           "JOIN FETCH s.assignment a " +
           "JOIN FETCH a.instructor " +
           "JOIN FETCH s.student " +
           "WHERE a.instructor.id = :instructorId AND s.status = 'PENDING_REVIEW' " +
           "ORDER BY s.createdAt DESC")
    Page<AssignmentSubmission> findPendingReviewsByInstructorId(@Param("instructorId") UUID instructorId, Pageable pageable);
    
    /**
     * Count submissions by status for an instructor's assignments
     */
    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.assignment.instructor.id = :instructorId AND s.status = :status")
    Long countByInstructorIdAndStatus(@Param("instructorId") UUID instructorId, @Param("status") SubmissionStatus status);
}

