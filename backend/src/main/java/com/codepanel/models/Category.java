package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;

    @Column
    private String description;

    @Column
    private String color;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<ProblemPost> problemPosts = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Assignment> assignments = new ArrayList<>();

    public Category() {}

    public Category(String name, String description, String color) {
        this.name = name;
        this.description = description;
        this.color = color;
    }
}

