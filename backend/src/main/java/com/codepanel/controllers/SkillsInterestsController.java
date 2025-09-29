package com.codepanel.controllers;

import com.codepanel.services.SkillsInterestsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkillsInterestsController {

    private final SkillsInterestsService skillsInterestsService;

    public SkillsInterestsController(SkillsInterestsService skillsInterestsService) {
        this.skillsInterestsService = skillsInterestsService;
    }

    @GetMapping("/skills")
    public ResponseEntity<List<String>> getPredefinedSkills() {
        List<String> skills = skillsInterestsService.getPredefinedSkills();
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/interests")
    public ResponseEntity<List<String>> getPredefinedInterests() {
        List<String> interests = skillsInterestsService.getPredefinedInterests();
        return ResponseEntity.ok(interests);
    }

    @GetMapping("/skills/search")
    public ResponseEntity<List<String>> searchSkills(@RequestParam(required = false) String q) {
        List<String> skills = skillsInterestsService.searchSkills(q);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/interests/search")
    public ResponseEntity<List<String>> searchInterests(@RequestParam(required = false) String q) {
        List<String> interests = skillsInterestsService.searchInterests(q);
        return ResponseEntity.ok(interests);
    }
}
