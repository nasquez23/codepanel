package com.codepanel.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codepanel.models.ProblemPost;
import com.codepanel.models.User;
import com.codepanel.models.enums.ProgrammingLanguage;

public interface ProblemPostRepository extends JpaRepository<ProblemPost, UUID> {
    Page<ProblemPost> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    /**
     * Search problem posts by title, description, or author name
     */
    @Query("SELECT p FROM ProblemPost p JOIN p.user u WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:language IS NULL OR p.language = :language)")
    Page<ProblemPost> searchProblemPosts(
        @Param("query") String query, 
        @Param("language") ProgrammingLanguage language, 
        Pageable pageable
    );
}
