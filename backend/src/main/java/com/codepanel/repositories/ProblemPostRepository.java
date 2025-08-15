package com.codepanel.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.codepanel.models.ProblemPost;
import com.codepanel.models.User;

public interface ProblemPostRepository extends JpaRepository<ProblemPost, UUID> {
    Page<ProblemPost> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
