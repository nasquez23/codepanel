package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "problem_posts")
@Entity
public class ProblemPost extends BaseEntity {
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Lob
    private String code;

    @Column(nullable = false)
    private ProgrammingLanguage language;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficultyLevel = DifficultyLevel.EASY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "problem_post_tags",
        joinColumns = @JoinColumn(name = "problem_post_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
}
