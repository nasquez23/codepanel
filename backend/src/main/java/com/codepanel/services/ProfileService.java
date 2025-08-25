package com.codepanel.services;

import com.codepanel.models.User;
import com.codepanel.models.dto.ProfileResponse;
import com.codepanel.models.dto.UpdateProfileRequest;
import com.codepanel.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final S3Service s3Service;

    public ProfileService(UserRepository userRepository, S3Service s3Service) {
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(User user) {
        return mapToProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
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
        return new ProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getProfilePictureUrl()
        );
    }
}
