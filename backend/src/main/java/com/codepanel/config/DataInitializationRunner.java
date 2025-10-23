package com.codepanel.config;

import com.codepanel.services.CategoryInitializerService;
import com.codepanel.services.TagInitializerService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationRunner implements CommandLineRunner {
    
    private final CategoryInitializerService categoryInitializerService;
    private final TagInitializerService tagInitializerService;
    
    public DataInitializationRunner(CategoryInitializerService categoryInitializerService,
                                   TagInitializerService tagInitializerService) {
        this.categoryInitializerService = categoryInitializerService;
        this.tagInitializerService = tagInitializerService;
    }
    
    @Override
    public void run(String... args) throws Exception {
            System.out.println("🚀 Auto-initializing data on startup...");
            
            try {
                // Initialize categories
                System.out.println("📁 Initializing categories...");
                categoryInitializerService.initializeCategories();
                
                // Initialize tags
                System.out.println("🏷️  Initializing tags...");
                tagInitializerService.initializeTags();
                
                System.out.println("✅ Data initialization completed successfully!");
                
            } catch (Exception e) {
                System.err.println("❌ Error during auto-initialization: " + e.getMessage());
                e.printStackTrace();
            }
    }
}
