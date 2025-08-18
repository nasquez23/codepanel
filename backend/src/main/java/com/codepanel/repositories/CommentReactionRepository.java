package com.codepanel.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codepanel.models.CommentReaction;
import com.codepanel.models.ProblemPostComment;
import com.codepanel.models.User;
import com.codepanel.models.enums.ReactionType;

public interface CommentReactionRepository extends JpaRepository<CommentReaction, UUID> {
    
    /**
     * Find a user's reaction to a specific comment
     */
    Optional<CommentReaction> findByCommentAndUser(ProblemPostComment comment, User user);
    
    /**
     * Check if a user has reacted to a comment
     */
    boolean existsByCommentAndUser(ProblemPostComment comment, User user);
    
    /**
     * Count likes for a specific comment
     */
    @Query("SELECT COUNT(r) FROM CommentReaction r WHERE r.comment.id = :commentId AND r.reactionType = :reactionType")
    Long countByCommentIdAndReactionType(@Param("commentId") UUID commentId, @Param("reactionType") ReactionType reactionType);
    
    /**
     * Get all reactions for a list of comments (for efficient loading)
     */
    @Query("SELECT r FROM CommentReaction r WHERE r.comment IN :comments")
    List<CommentReaction> findByCommentIn(@Param("comments") List<ProblemPostComment> comments);
    
    /**
     * Get user's reactions for a list of comments
     */
    @Query("SELECT r FROM CommentReaction r WHERE r.comment IN :comments AND r.user = :user")
    List<CommentReaction> findByCommentInAndUser(@Param("comments") List<ProblemPostComment> comments, @Param("user") User user);
    
    /**
     * Delete user's reaction to a comment
     */
    void deleteByCommentAndUser(ProblemPostComment comment, User user);
}
