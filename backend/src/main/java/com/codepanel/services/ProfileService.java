package com.codepanel.services;

import com.codepanel.models.User;
import com.codepanel.models.dto.ProfileResponse;
import com.codepanel.models.dto.UpdateProfileRequest;
import com.codepanel.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final SkillsInterestsService skillsInterestsService;

    public ProfileService(UserRepository userRepository, S3Service s3Service, SkillsInterestsService skillsInterestsService) {
        this.userRepository = userRepository;
        this.s3Service = s3Service;
        this.skillsInterestsService = skillsInterestsService;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(User user) {
        try {
            ProfileResponse response = mapToProfileResponse(user);
            return response;
        } catch (Exception e) {
            System.err.println("Error getting profile: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(request.getBio());
        
        // Normalize and set skills
        List<String> normalizedSkills = request.getSkills() != null 
            ? request.getSkills().stream()
                .map(skillsInterestsService::normalizeSkill)
                .filter(skill -> skill != null && !skill.trim().isEmpty())
                .distinct()
                .collect(Collectors.toList())
            : new ArrayList<>();
        user.setSkills(normalizedSkills);
        
        // Normalize and set interests
        List<String> normalizedInterests = request.getInterests() != null
            ? request.getInterests().stream()
                .map(skillsInterestsService::normalizeInterest)
                .filter(interest -> interest != null && !interest.trim().isEmpty())
                .distinct()
                .collect(Collectors.toList())
            : new ArrayList<>();
        user.setInterests(normalizedInterests);
        
        user.setSocialLinks(request.getSocialLinks());

        User savedUser = userRepository.save(user);
        return mapToProfileResponse(savedUser);
    }

    @Transactional
    public ProfileResponse uploadProfilePicture(User user, MultipartFile file) throws IOException {
        try {
            // Delete old profile picture if exists
            if (user.getProfilePictureUrl() != null) {
                s3Service.deleteProfileImage(user.getProfilePictureUrl());
            }

            // Upload new profile picture
            String profilePictureUrl = s3Service.uploadProfileImage(file, user.getId().toString());

            // Update user with new profile picture URL
            user.setProfilePictureUrl(profilePictureUrl);
            User savedUser = userRepository.save(user);

            return mapToProfileResponse(savedUser);
        } catch (Exception e) {
            System.out.println("Error uploading profile picture" + e.getMessage());
            throw e;
        }
    }

    @Transactional
    public ProfileResponse removeProfilePicture(User user) {
        // Delete profile picture from S3
        if (user.getProfilePictureUrl() != null) {
            s3Service.deleteProfileImage(user.getProfilePictureUrl());
        }

        // Remove profile picture URL from user
        user.setProfilePictureUrl(null);
        User savedUser = userRepository.save(user);

        return mapToProfileResponse(savedUser);
    }

    private ProfileResponse mapToProfileResponse(User user) {
        try {
            List<String> skills = user.getSkills() != null ? user.getSkills() : new ArrayList<>();

            List<String> interests = user.getInterests() != null ? user.getInterests() : new ArrayList<>();

            ProfileResponse response = new ProfileResponse(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getProfilePictureUrl(),
                    user.getBio(),
                    skills,
                    interests,
                    user.getSocialLinks());
            return response;
        } catch (Exception e) {
            System.err.println("Error mapping user to profile response: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
