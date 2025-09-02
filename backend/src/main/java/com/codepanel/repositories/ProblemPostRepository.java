package com.codepanel.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codepanel.models.ProblemPost;
import com.codepanel.models.User;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;

import java.util.List;

public interface ProblemPostRepository extends JpaRepository<ProblemPost, UUID> {
    Page<ProblemPost> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    @Query("SELECT p FROM ProblemPost p LEFT JOIN FETCH p.user LEFT JOIN FETCH p.category LEFT JOIN FETCH p.tags")
    Page<ProblemPost> findAllWithRelations(Pageable pageable);
    
    /**
     * Search problem posts by title, description, or author name with filters
     */
    @Query("SELECT DISTINCT p FROM ProblemPost p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.category c " +
           "LEFT JOIN FETCH p.tags t WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:language IS NULL OR p.language = :language) AND " +
           "(:difficulty IS NULL OR p.difficultyLevel = :difficulty) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:tagIds IS NULL OR t.id IN :tagIds)")
    Page<ProblemPost> searchProblemPosts(
        @Param("query") String query, 
        @Param("language") ProgrammingLanguage language,
        @Param("difficulty") DifficultyLevel difficulty,
        @Param("categoryId") UUID categoryId,
        @Param("tagIds") List<UUID> tagIds,
        Pageable pageable
    );

    @Query("SELECT p FROM ProblemPost p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.tags WHERE p.id = :id")
    ProblemPost findByIdWithCategoryAndTags(@Param("id") UUID id);
}
