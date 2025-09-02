package com.codepanel.models.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryResponse {
    private UUID id;
    private String name;
    private String description;
    private String color;
}

