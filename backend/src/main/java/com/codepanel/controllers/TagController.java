package com.codepanel.controllers;

import com.codepanel.models.Tag;
import com.codepanel.services.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable UUID id) {
        return tagService.getTagById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Tag>> searchTags(@RequestParam String keyword) {
        List<Tag> tags = tagService.searchTags(keyword);
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String description = request.get("description");
            String color = request.get("color");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Tag tag = tagService.createTag(name, description, color);
            return ResponseEntity.ok(tag);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String description = request.get("description");
            String color = request.get("color");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Tag tag = tagService.updateTag(id, name, description, color);
            return ResponseEntity.ok(tag);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable UUID id) {
        try {
            tagService.deleteTag(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Long>> getTagStats(@PathVariable UUID id) {
        Long problemPostCount = tagService.getProblemPostCount(id);
        Long assignmentCount = tagService.getAssignmentCount(id);

        Map<String, Long> stats = Map.of(
                "problemPosts", problemPostCount,
                "assignments", assignmentCount,
                "total", problemPostCount + assignmentCount);

        return ResponseEntity.ok(stats);
    }
}
