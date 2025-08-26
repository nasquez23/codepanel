package com.codepanel.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codepanel.models.Assignment;
import com.codepanel.models.User;
import com.codepanel.models.enums.ProgrammingLanguage;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    
    /**
     * Find all active assignments ordered by due date with instructor eagerly loaded
     */
    @Query("SELECT a FROM Assignment a JOIN FETCH a.instructor WHERE a.isActive = true ORDER BY a.dueDate ASC")
    Page<Assignment> findByIsActiveTrueOrderByDueDateAsc(Pageable pageable);
    
    /**
     * Find assignments by instructor ordered by creation date (newest first) with instructor eagerly loaded
     */
    @Query("SELECT a FROM Assignment a JOIN FETCH a.instructor WHERE a.instructor = :instructor ORDER BY a.createdAt DESC")
    Page<Assignment> findByInstructorOrderByCreatedAtDesc(@Param("instructor") User instructor, Pageable pageable);
    
    /**
     * Find assignments by instructor and active status
     */
    Page<Assignment> findByInstructorAndIsActiveOrderByCreatedAtDesc(User instructor, Boolean isActive, Pageable pageable);
    
    /**
     * Count submissions for an assignment
     */
    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId")
    Long countSubmissionsByAssignmentId(@Param("assignmentId") UUID assignmentId);
    
    /**
     * Find assignment by ID with instructor eagerly loaded
     */
    @Query("SELECT a FROM Assignment a JOIN FETCH a.instructor WHERE a.id = :id")
    Assignment findByIdWithInstructor(@Param("id") UUID id);
    
    /**
     * Check if a user has submitted to an assignment
     */
    @Query("SELECT COUNT(s) > 0 FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId AND s.student.id = :studentId")
    Boolean hasUserSubmitted(@Param("assignmentId") UUID assignmentId, @Param("studentId") UUID studentId);
    
    /**
     * Search assignments by title, description, or instructor name
     */
    @Query("SELECT a FROM Assignment a JOIN FETCH a.instructor i WHERE " +
           "a.isActive = true AND " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CONCAT(i.firstName, ' ', i.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:language IS NULL OR a.language = :language)")
    Page<Assignment> searchAssignments(
        @Param("query") String query,
        @Param("language") ProgrammingLanguage language,
        Pageable pageable
    );
}
