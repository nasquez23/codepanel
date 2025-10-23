package com.codepanel.services;

import com.codepanel.models.Category;
import com.codepanel.repositories.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryInitializerService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryInitializerService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    private static final List<CategoryData> PREDEFINED_CATEGORIES = Arrays.asList(
        
        // Web Development
        new CategoryData("Frontend Development", "Frontend web development challenges", "#61DAFB"),
        new CategoryData("Backend Development", "Backend web development challenges", "#68D391"),
        new CategoryData("Full-Stack Development", "Full-stack web development challenges", "#9F7AEA"),
        new CategoryData("React", "React.js specific challenges and exercises", "#61DAFB"),
        new CategoryData("Vue.js", "Vue.js specific challenges and exercises", "#4FC08D"),
        new CategoryData("Angular", "Angular specific challenges and exercises", "#DD0031"),
        new CategoryData("Node.js", "Node.js backend development challenges", "#339933"),
        
        // Data & AI
        new CategoryData("Data Structures", "Data structures and algorithms challenges", "#FF6B6B"),
        new CategoryData("Algorithms", "Algorithm design and optimization challenges", "#4ECDC4"),
        new CategoryData("Machine Learning", "Machine learning and AI challenges", "#45B7D1"),
        new CategoryData("Data Science", "Data science and analytics challenges", "#96CEB4"),
        new CategoryData("Database Design", "Database design and SQL challenges", "#FFEAA7"),
        
        // Mobile Development
        new CategoryData("Mobile Development", "Mobile app development challenges", "#6C5CE7"),
        new CategoryData("iOS Development", "iOS app development challenges", "#A29BFE"),
        new CategoryData("Android Development", "Android app development challenges", "#00B894"),
        new CategoryData("React Native", "React Native mobile development challenges", "#61DAFB"),
        new CategoryData("Flutter", "Flutter mobile development challenges", "#02569B"),
        
        // DevOps & Cloud
        new CategoryData("DevOps", "DevOps and infrastructure challenges", "#FF7675"),
        new CategoryData("Cloud Computing", "Cloud platform challenges (AWS, Azure, GCP)", "#74B9FF"),
        new CategoryData("Docker", "Containerization and Docker challenges", "#0984E3"),
        new CategoryData("Kubernetes", "Kubernetes orchestration challenges", "#6C5CE7"),
        
        // Security & Testing
        new CategoryData("Cybersecurity", "Cybersecurity and ethical hacking challenges", "#E17055"),
        new CategoryData("Testing", "Software testing and QA challenges", "#FDCB6E"),
        new CategoryData("Performance", "Performance optimization challenges", "#A29BFE"),
        
        // Specialized Fields
        new CategoryData("Blockchain", "Blockchain and cryptocurrency challenges", "#FDCB6E"),
        new CategoryData("Game Development", "Game development challenges", "#E84393"),
        new CategoryData("IoT", "Internet of Things development challenges", "#00B894"),
        new CategoryData("AR/VR", "Augmented and Virtual Reality challenges", "#6C5CE7"),
        
        // General Programming
        new CategoryData("System Design", "System architecture and design challenges", "#FD79A8"),
        new CategoryData("Code Review", "Code review and best practices", "#FDCB6E"),
        new CategoryData("Open Source", "Open source contribution challenges", "#00B894"),
        new CategoryData("Interview Prep", "Technical interview preparation", "#E17055")
    );
    
    @Transactional
    public void initializeCategories() {
        System.out.println("🚀 Initializing categories...");
        
        for (CategoryData categoryData : PREDEFINED_CATEGORIES) {
            // Check if category already exists
            Optional<Category> existingCategory = categoryRepository.findByNameIgnoreCase(categoryData.name);
            
            if (existingCategory.isEmpty()) {
                Category category = new Category(
                    categoryData.name,
                    categoryData.description,
                    categoryData.color
                );
                categoryRepository.save(category);
                System.out.println("✅ Created category: " + categoryData.name);
            } else {
                System.out.println("⏭️  Category already exists: " + categoryData.name);
            }
        }
        
        System.out.println("🎉 Category initialization completed!");
    }
    
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public long getCategoryCount() {
        return categoryRepository.count();
    }
    
    private static class CategoryData {
        final String name;
        final String description;
        final String color;
        
        CategoryData(String name, String description, String color) {
            this.name = name;
            this.description = description;
            this.color = color;
        }
    }
}
