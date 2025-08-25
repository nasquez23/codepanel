package com.codepanel.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadProfileImage(MultipartFile file, String userId) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 5MB limit.");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = "profile-images/" + userId + "/" + originalFilename;

        // Set object metadata
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(contentType);
        metadata.setContentLength(file.getSize());
        metadata.setCacheControl("max-age=31536000"); // Cache for 1 year

        // Upload file (bucket should be configured for public read access via bucket policy)
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, uniqueFilename, file.getInputStream(),
                metadata);

        amazonS3.putObject(putObjectRequest);

        // Return the public URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, uniqueFilename);
    }

    public void deleteProfileImage(String imageUrl) {
        if (imageUrl != null && imageUrl.contains(bucketName)) {
            try {
                // Extract the key from the URL
                String key = imageUrl.substring(imageUrl.indexOf(".com/") + 5);
                amazonS3.deleteObject(bucketName, key);
            } catch (Exception e) {
                // Log error but don't throw exception to not break the profile update
                System.err.println("Error deleting profile image: " + e.getMessage());
            }
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null && (contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/webp"));
    }
}
