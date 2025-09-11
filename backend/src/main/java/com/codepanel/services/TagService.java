package com.codepanel.services;

import com.codepanel.models.Tag;
import com.codepanel.repositories.TagRepository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Cacheable(value = "tags")
    public List<Tag> getAllTags() {
        return tagRepository.findAllOrderByName();
    }

    public Optional<Tag> getTagById(UUID id) {
        return tagRepository.findById(id);
    }

    public Optional<Tag> getTagByName(String name) {
        return tagRepository.findByNameIgnoreCase(name);
    }

    public List<Tag> searchTags(String keyword) {
        return tagRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Transactional
    @CacheEvict(value = "tags", allEntries = true)
    public Tag createTag(String name, String description, String color) {
        // Check if tag already exists
        Optional<Tag> existingTag = tagRepository.findByNameIgnoreCase(name);
        if (existingTag.isPresent()) {
            throw new IllegalArgumentException("Tag with name '" + name + "' already exists");
        }

        Tag tag = new Tag(name.trim(), description, color);
        return tagRepository.save(tag);
    }

    @Transactional
    @CacheEvict(value = "tags", allEntries = true)
    public Tag updateTag(UUID id, String name, String description, String color) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!tag.getName().equalsIgnoreCase(name)) {
            Optional<Tag> existingTag = tagRepository.findByNameIgnoreCase(name);
            if (existingTag.isPresent()) {
                throw new IllegalArgumentException("Tag with name '" + name + "' already exists");
            }
        }

        tag.setName(name.trim());
        tag.setDescription(description);
        tag.setColor(color);
        return tagRepository.save(tag);
    }

    @Transactional
    @CacheEvict(value = "tags", allEntries = true)
    public void deleteTag(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found with id: " + id));

        // Check if tag is being used
        Long problemPostCount = tagRepository.countProblemPostsByTag(id);
        Long assignmentCount = tagRepository.countAssignmentsByTag(id);

        if (problemPostCount > 0 || assignmentCount > 0) {
            throw new IllegalStateException("Cannot delete tag that is being used by " +
                    (problemPostCount + assignmentCount) + " items");
        }

        tagRepository.delete(tag);
    }

    public Long getProblemPostCount(UUID tagId) {
        return tagRepository.countProblemPostsByTag(tagId);
    }

    public Long getAssignmentCount(UUID tagId) {
        return tagRepository.countAssignmentsByTag(tagId);
    }
}
