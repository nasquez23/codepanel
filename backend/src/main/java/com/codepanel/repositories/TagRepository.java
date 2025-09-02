package com.codepanel.repositories;

import com.codepanel.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
    Optional<Tag> findByNameIgnoreCase(String name);

    @Query("SELECT t FROM Tag t ORDER BY t.name ASC")
    List<Tag> findAllOrderByName();

    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY t.name ASC")
    List<Tag> findByNameContainingIgnoreCase(@Param("keyword") String keyword);

    @Query("SELECT COUNT(pp) FROM ProblemPost pp JOIN pp.tags t WHERE t.id = :tagId")
    Long countProblemPostsByTag(@Param("tagId") UUID tagId);

    @Query("SELECT COUNT(a) FROM Assignment a JOIN a.tags t WHERE t.id = :tagId")
    Long countAssignmentsByTag(@Param("tagId") UUID tagId);
}

