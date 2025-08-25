package com.codepanel.controllers;

import com.codepanel.models.User;
import com.codepanel.models.dto.ProfileResponse;
import com.codepanel.models.dto.UpdateProfileRequest;
import com.codepanel.services.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        ProfileResponse profile = profileService.getProfile(user);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        ProfileResponse updatedProfile = profileService.updateProfile(user, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfilePicture(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }
            System.out.println("Uploading profile picture" + file);
            ProfileResponse updatedProfile = profileService.uploadProfilePicture(user, file);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload profile picture");
        }
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<ProfileResponse> removeProfilePicture(@AuthenticationPrincipal User user) {
        ProfileResponse updatedProfile = profileService.removeProfilePicture(user);
        return ResponseEntity.ok(updatedProfile);
    }
}
