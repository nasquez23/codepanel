package com.codepanel.repositories;

import com.codepanel.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findByNameIgnoreCase(String name);

    @Query("SELECT c FROM Category c ORDER BY c.name ASC")
    List<Category> findAllOrderByName();

    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY c.name ASC")
    List<Category> findByNameContainingIgnoreCase(@Param("keyword") String keyword);

    @Query("SELECT COUNT(pp) FROM ProblemPost pp WHERE pp.category.id = :categoryId")
    Long countProblemPostsByCategory(@Param("categoryId") UUID categoryId);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.category.id = :categoryId")
    Long countAssignmentsByCategory(@Param("categoryId") UUID categoryId);
}

