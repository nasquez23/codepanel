package com.codepanel.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codepanel.models.ProblemPost;
import com.codepanel.models.ProblemPostComment;
import com.codepanel.models.User;

public interface ProblemPostCommentRepository extends JpaRepository<ProblemPostComment, UUID> {
    
    /**
     * Find all comments for a specific problem post, ordered by creation date (newest first)
     */
    Page<ProblemPostComment> findByProblemPostOrderByCreatedAtDesc(ProblemPost problemPost, Pageable pageable);
    
    /**
     * Find all comments by a specific user, ordered by creation date (newest first)
     */
    Page<ProblemPostComment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    /**
     * Count total comments for a specific problem post
     */
    @Query("SELECT COUNT(c) FROM ProblemPostComment c WHERE c.problemPost.id = :problemPostId")
    Long countByProblemPostId(@Param("problemPostId") UUID problemPostId);
    
    /**
     * Find comments with pagination and sorting by likes
     */
    Page<ProblemPostComment> findByProblemPostOrderByLikesDesc(ProblemPost problemPost, Pageable pageable);
}
