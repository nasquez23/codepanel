package com.codepanel.controllers;

import com.codepanel.models.Category;
import com.codepanel.services.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        try {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
        } catch (Exception e) {
            System.out.println("Error fetching categories: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable UUID id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Category>> searchCategories(@RequestParam String keyword) {
        List<Category> categories = categoryService.searchCategories(keyword);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String description = request.get("description");
            String color = request.get("color");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Category category = categoryService.createCategory(name, description, color);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String description = request.get("description");
            String color = request.get("color");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Category category = categoryService.updateCategory(id, name, description, color);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Long>> getCategoryStats(@PathVariable UUID id) {
        Long problemPostCount = categoryService.getProblemPostCount(id);
        Long assignmentCount = categoryService.getAssignmentCount(id);
        
        Map<String, Long> stats = Map.of(
            "problemPosts", problemPostCount,
            "assignments", assignmentCount,
            "total", problemPostCount + assignmentCount
        );
        
        return ResponseEntity.ok(stats);
    }
}

