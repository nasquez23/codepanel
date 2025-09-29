package com.codepanel.services;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillsInterestsService {

    private static final List<String> PREDEFINED_SKILLS = Arrays.asList(
            // Programming Languages
            "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
            "Swift", "Kotlin", "PHP", "Ruby", "Scala", "Dart", "R",

            // Frontend Technologies
            "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "HTML/CSS",
            "Tailwind CSS", "Bootstrap", "Sass/SCSS", "jQuery", "Redux", "Vuex",

            // Backend Technologies
            "Node.js", "Express.js", "Spring Boot", "Django", "Flask", "FastAPI",
            "ASP.NET", "Laravel", "Ruby on Rails", "NestJS", "Fastify",

            // Databases
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle",
            "Cassandra", "DynamoDB", "Firebase", "Supabase",

            // Cloud & DevOps
            "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
            "GitHub Actions", "GitLab CI", "Terraform", "Ansible", "Nginx",

            // Mobile Development
            "React Native", "Flutter", "iOS Development", "Android Development",
            "Xamarin", "Ionic", "Cordova",

            // Tools & Others
            "Git", "Linux", "macOS", "Windows", "VS Code", "IntelliJ IDEA",
            "Figma", "Adobe XD", "Photoshop", "Illustrator", "Postman",

            // Testing
            "Jest", "Cypress", "Selenium", "JUnit", "pytest", "Mocha", "Chai",

            // Data & AI
            "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Apache Spark",
            "Tableau", "Power BI", "Excel", "SQL");

    private static final List<String> PREDEFINED_INTERESTS = Arrays.asList(
            // Development Areas
            "Web Development", "Mobile Development", "Desktop Development",
            "Game Development", "Full-Stack Development", "Frontend Development",
            "Backend Development", "API Development",

            // Specialized Fields
            "Machine Learning", "Artificial Intelligence", "Data Science",
            "Data Analytics", "Deep Learning", "Computer Vision", "Natural Language Processing",
            "Blockchain Development", "Cryptocurrency", "Smart Contracts",

            // Infrastructure & Systems
            "DevOps", "Cloud Computing", "System Administration", "Network Security",
            "Cybersecurity", "Ethical Hacking", "Penetration Testing",

            // Design & UX
            "UI/UX Design", "Graphic Design", "User Experience", "User Interface Design",
            "Product Design", "Interaction Design", "Accessibility",

            // Emerging Technologies
            "Internet of Things (IoT)", "Augmented Reality (AR)", "Virtual Reality (VR)",
            "Quantum Computing", "Edge Computing", "5G Technology",

            // Business & Management
            "Project Management", "Agile Methodology", "Scrum", "Product Management",
            "Technical Writing", "Software Architecture",

            // Learning & Teaching
            "Open Source", "Mentoring", "Code Review", "Technical Documentation",
            "Algorithm Design", "Data Structures", "System Design",

            // Industry Domains
            "FinTech", "HealthTech", "EdTech", "E-commerce", "SaaS", "Enterprise Software",
            "Startups", "Consulting", "Freelancing");

    public List<String> getPredefinedSkills() {
        return PREDEFINED_SKILLS.stream()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getPredefinedInterests() {
        return PREDEFINED_INTERESTS.stream()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> searchSkills(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getPredefinedSkills();
        }

        String lowerQuery = query.toLowerCase().trim();
        return PREDEFINED_SKILLS.stream()
                .filter(skill -> skill.toLowerCase().contains(lowerQuery))
                .sorted((a, b) -> {
                    // Prioritize exact matches and starts-with matches
                    boolean aStarts = a.toLowerCase().startsWith(lowerQuery);
                    boolean bStarts = b.toLowerCase().startsWith(lowerQuery);

                    if (aStarts && !bStarts)
                        return -1;
                    if (!aStarts && bStarts)
                        return 1;

                    return a.compareToIgnoreCase(b);
                })
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<String> searchInterests(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getPredefinedInterests();
        }

        String lowerQuery = query.toLowerCase().trim();
        return PREDEFINED_INTERESTS.stream()
                .filter(interest -> interest.toLowerCase().contains(lowerQuery))
                .sorted((a, b) -> {
                    // Prioritize exact matches and starts-with matches
                    boolean aStarts = a.toLowerCase().startsWith(lowerQuery);
                    boolean bStarts = b.toLowerCase().startsWith(lowerQuery);

                    if (aStarts && !bStarts)
                        return -1;
                    if (!aStarts && bStarts)
                        return 1;

                    return a.compareToIgnoreCase(b);
                })
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * Normalize user input to match predefined options when possible
     */
    public String normalizeSkill(String skill) {
        if (skill == null)
            return null;

        String trimmed = skill.trim();

        // Find exact match (case insensitive)
        for (String predefined : PREDEFINED_SKILLS) {
            if (predefined.equalsIgnoreCase(trimmed)) {
                return predefined;
            }
        }

        // Find partial matches for common variations
        String lower = trimmed.toLowerCase();
        if (lower.equals("js") || lower.equals("javascript"))
            return "JavaScript";
        if (lower.equals("ts") || lower.equals("typescript"))
            return "TypeScript";
        if (lower.equals("react.js"))
            return "React";
        if (lower.equals("vue"))
            return "Vue.js";
        if (lower.equals("node"))
            return "Node.js";
        if (lower.equals("postgres") || lower.equals("postgresql"))
            return "PostgreSQL";
        if (lower.equals("mongo") || lower.equals("mongodb"))
            return "MongoDB";

        // Return original if no match found (allows custom entries)
        return trimmed;
    }

    public String normalizeInterest(String interest) {
        if (interest == null)
            return null;

        String trimmed = interest.trim();

        // Find exact match (case insensitive)
        for (String predefined : PREDEFINED_INTERESTS) {
            if (predefined.equalsIgnoreCase(trimmed)) {
                return predefined;
            }
        }

        // Find partial matches for common variations
        String lower = trimmed.toLowerCase();
        if (lower.contains("machine learning") || lower.equals("ml"))
            return "Machine Learning";
        if (lower.contains("artificial intelligence") || lower.equals("ai"))
            return "Artificial Intelligence";
        if (lower.contains("ui/ux") || lower.contains("ux/ui"))
            return "UI/UX Design";
        if (lower.contains("full stack") || lower.contains("fullstack"))
            return "Full-Stack Development";

        // Return original if no match found (allows custom entries)
        return trimmed;
    }
}
