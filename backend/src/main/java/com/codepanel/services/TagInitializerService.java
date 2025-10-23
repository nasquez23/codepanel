package com.codepanel.services;

import com.codepanel.models.Tag;
import com.codepanel.repositories.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class TagInitializerService {
    
    private final TagRepository tagRepository;
    
    public TagInitializerService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }
    
    private static final List<TagData> PREDEFINED_TAGS = Arrays.asList(
        
        // Data Structures
        new TagData("Array", "Array-based problems", "#E91E63"),
        new TagData("Linked List", "Linked list problems", "#9C27B0"),
        new TagData("Stack", "Stack-based problems", "#673AB7"),
        new TagData("Queue", "Queue-based problems", "#3F51B5"),
        new TagData("Tree", "Tree data structure problems", "#2196F3"),
        new TagData("Graph", "Graph algorithm problems", "#00BCD4"),
        new TagData("Hash Table", "Hash table problems", "#009688"),
        new TagData("Heap", "Heap data structure problems", "#4CAF50"),
        new TagData("Trie", "Trie data structure problems", "#8BC34A"),
        new TagData("Segment Tree", "Segment tree problems", "#CDDC39"),
        
        // Algorithm Types
        new TagData("Sorting", "Sorting algorithm problems", "#FFEB3B"),
        new TagData("Searching", "Searching algorithm problems", "#FFC107"),
        new TagData("Dynamic Programming", "Dynamic programming problems", "#FF9800"),
        new TagData("Greedy", "Greedy algorithm problems", "#FF5722"),
        new TagData("Backtracking", "Backtracking algorithm problems", "#795548"),
        new TagData("Divide and Conquer", "Divide and conquer problems", "#607D8B"),
        new TagData("Two Pointers", "Two pointers technique", "#9E9E9E"),
        new TagData("Sliding Window", "Sliding window technique", "#FF4081"),
        new TagData("Binary Search", "Binary search problems", "#E91E63"),
        new TagData("BFS", "Breadth-first search problems", "#9C27B0"),
        new TagData("DFS", "Depth-first search problems", "#673AB7"),
        
        // Problem Types
        new TagData("String Manipulation", "String processing problems", "#3F51B5"),
        new TagData("Math", "Mathematical problems", "#2196F3"),
        new TagData("Geometry", "Geometric problems", "#00BCD4"),
        new TagData("Number Theory", "Number theory problems", "#009688"),
        new TagData("Combinatorics", "Combinatorial problems", "#4CAF50"),
        new TagData("Probability", "Probability problems", "#8BC34A"),
        new TagData("Simulation", "Simulation problems", "#CDDC39"),
        new TagData("Implementation", "Implementation problems", "#FFEB3B"),
        
        // Specialized Topics
        new TagData("Bit Manipulation", "Bit manipulation problems", "#FFC107"),
        new TagData("System Design", "System design problems", "#FF9800"),
        new TagData("Concurrency", "Concurrency and threading problems", "#FF5722"),
        new TagData("Database", "Database-related problems", "#795548"),
        new TagData("Networking", "Computer networking problems", "#607D8B"),
        new TagData("Security", "Cybersecurity problems", "#9E9E9E"),
        new TagData("Cryptography", "Cryptography problems", "#FF4081"),
        
        // Web Development
        new TagData("API Design", "API design and development", "#E91E63"),
        new TagData("REST", "RESTful API problems", "#9C27B0"),
        new TagData("GraphQL", "GraphQL problems", "#673AB7"),
        new TagData("Microservices", "Microservices architecture", "#3F51B5"),
        new TagData("Caching", "Caching strategies", "#2196F3"),
        new TagData("Load Balancing", "Load balancing problems", "#00BCD4"),
        
        // Mobile Development
        new TagData("iOS", "iOS development problems", "#009688"),
        new TagData("Android", "Android development problems", "#4CAF50"),
        new TagData("Cross-Platform", "Cross-platform development", "#8BC34A"),
        new TagData("Performance", "Performance optimization", "#CDDC39"),
        new TagData("Memory Management", "Memory management problems", "#FFEB3B"),
        
        // Data Science & AI
        new TagData("Machine Learning", "Machine learning problems", "#FFC107"),
        new TagData("Deep Learning", "Deep learning problems", "#FF9800"),
        new TagData("NLP", "Natural language processing", "#FF5722"),
        new TagData("Computer Vision", "Computer vision problems", "#795548"),
        new TagData("Data Analysis", "Data analysis problems", "#607D8B"),
        new TagData("Statistics", "Statistical problems", "#9E9E9E"),
        
        // Industry Specific
        new TagData("FinTech", "Financial technology problems", "#FF4081"),
        new TagData("HealthTech", "Healthcare technology problems", "#E91E63"),
        new TagData("EdTech", "Educational technology problems", "#9C27B0"),
        new TagData("E-commerce", "E-commerce problems", "#673AB7"),
        new TagData("Gaming", "Game development problems", "#3F51B5"),
        new TagData("IoT", "Internet of Things problems", "#2196F3"),
        
        // Interview Preparation
        new TagData("Interview", "Interview preparation problems", "#00BCD4"),
        new TagData("Behavioral", "Behavioral interview questions", "#009688"),
        new TagData("Technical", "Technical interview questions", "#4CAF50"),
        new TagData("Coding Challenge", "Coding challenge problems", "#8BC34A"),
        new TagData("Whiteboard", "Whiteboard coding problems", "#CDDC39"),
        
        // Popular Platforms
        new TagData("LeetCode", "LeetCode-style problems", "#FFEB3B"),
        new TagData("HackerRank", "HackerRank-style problems", "#FFC107"),
        new TagData("CodeForces", "CodeForces-style problems", "#FF9800"),
        new TagData("AtCoder", "AtCoder-style problems", "#FF5722"),
        new TagData("TopCoder", "TopCoder-style problems", "#795548")
    );
    
    @Transactional
    public void initializeTags() {
        System.out.println("🚀 Initializing tags...");
        
        for (TagData tagData : PREDEFINED_TAGS) {
            // Check if tag already exists
            Optional<Tag> existingTag = tagRepository.findByNameIgnoreCase(tagData.name);
            
            if (existingTag.isEmpty()) {
                Tag tag = new Tag(
                    tagData.name,
                    tagData.description,
                    tagData.color
                );
                tagRepository.save(tag);
                System.out.println("✅ Created tag: " + tagData.name);
            } else {
                System.out.println("⏭️  Tag already exists: " + tagData.name);
            }
        }
        
        System.out.println("🎉 Tag initialization completed!");
    }
    
    @Transactional(readOnly = true)
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public long getTagCount() {
        return tagRepository.count();
    }
    
    private static class TagData {
        final String name;
        final String description;
        final String color;
        
        TagData(String name, String description, String color) {
            this.name = name;
            this.description = description;
            this.color = color;
        }
    }
}
