package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tags")
public class Tag extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;

    @Column
    private String description;

    @Column
    private String color;

    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    private Set<ProblemPost> problemPosts = new HashSet<>();

    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    private Set<Assignment> assignments = new HashSet<>();

    public Tag() {}

    public Tag(String name, String description, String color) {
        this.name = name;
        this.description = description;
        this.color = color;
    }
}

