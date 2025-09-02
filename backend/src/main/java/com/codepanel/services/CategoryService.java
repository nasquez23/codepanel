package com.codepanel.services;

import com.codepanel.models.Category;
import com.codepanel.repositories.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllOrderByName();
    }

    public Optional<Category> getCategoryById(UUID id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByNameIgnoreCase(name);
    }

    public List<Category> searchCategories(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Transactional
    public Category createCategory(String name, String description, String color) {
        // Check if category already exists
        Optional<Category> existingCategory = categoryRepository.findByNameIgnoreCase(name);
        if (existingCategory.isPresent()) {
            throw new IllegalArgumentException("Category with name '" + name + "' already exists");
        }

        Category category = new Category(name.trim(), description, color);
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(UUID id, String name, String description, String color) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!category.getName().equalsIgnoreCase(name)) {
            Optional<Category> existingCategory = categoryRepository.findByNameIgnoreCase(name);
            if (existingCategory.isPresent()) {
                throw new IllegalArgumentException("Category with name '" + name + "' already exists");
            }
        }

        category.setName(name.trim());
        category.setDescription(description);
        category.setColor(color);
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        // Check if category is being used
        Long problemPostCount = categoryRepository.countProblemPostsByCategory(id);
        Long assignmentCount = categoryRepository.countAssignmentsByCategory(id);
        
        if (problemPostCount > 0 || assignmentCount > 0) {
            throw new IllegalStateException("Cannot delete category that is being used by " + 
                (problemPostCount + assignmentCount) + " items");
        }

        categoryRepository.delete(category);
    }

    public Long getProblemPostCount(UUID categoryId) {
        return categoryRepository.countProblemPostsByCategory(categoryId);
    }

    public Long getAssignmentCount(UUID categoryId) {
        return categoryRepository.countAssignmentsByCategory(categoryId);
    }
}

