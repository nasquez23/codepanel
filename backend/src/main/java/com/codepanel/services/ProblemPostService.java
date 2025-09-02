package com.codepanel.services;

import com.codepanel.models.Category;
import com.codepanel.models.ProblemPost;
import com.codepanel.models.Tag;
import com.codepanel.models.User;
import com.codepanel.models.dto.CategoryResponse;
import com.codepanel.models.dto.CreateProblemPostRequest;
import com.codepanel.models.dto.TagResponse;
import com.codepanel.models.dto.UpdateProblemPostRequest;
import com.codepanel.models.dto.ProblemPostResponse;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;
import com.codepanel.repositories.CategoryRepository;
import com.codepanel.repositories.TagRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.codepanel.repositories.ProblemPostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ProblemPostService {

    private final ProblemPostRepository problemPostRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public ProblemPostService(ProblemPostRepository problemPostRepository,
                             CategoryRepository categoryRepository,
                             TagRepository tagRepository) {
        this.problemPostRepository = problemPostRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional
    public ProblemPostResponse createProblemPost(CreateProblemPostRequest request, User currentUser) {
        ProblemPost problemPost = new ProblemPost();
        problemPost.setTitle(request.getTitle());
        problemPost.setDescription(request.getDescription());
        problemPost.setCode(request.getCode());
        problemPost.setLanguage(request.getLanguage());
        problemPost.setDifficultyLevel(request.getDifficultyLevel());
        problemPost.setUser(currentUser);
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
            problemPost.setCategory(category);
        }

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (UUID tagId : request.getTagIds()) {
                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag not found: " + tagId));
                tags.add(tag);
            }
            problemPost.setTags(tags);
        }

        ProblemPost savedPost = problemPostRepository.save(problemPost);
        return mapToResponse(savedPost);
    }

    public Page<ProblemPostResponse> getAllProblemPosts(Pageable pageable) {
        Page<ProblemPost> problemPosts = problemPostRepository.findAllWithRelations(pageable);
        return problemPosts.map(this::mapToResponse);
    }

    public ProblemPostResponse getProblemPostById(UUID id) {
        ProblemPost problemPost = problemPostRepository.findByIdWithCategoryAndTags(id);
        if (problemPost == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found");
        }
        return mapToResponse(problemPost);
    }

    public Page<ProblemPostResponse> getProblemPostsByUser(User user, Pageable pageable) {
        Page<ProblemPost> problemPosts = problemPostRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return problemPosts.map(this::mapToResponse);
    }

    public Page<ProblemPostResponse> searchProblemPosts(String query, ProgrammingLanguage language, 
                                                       DifficultyLevel difficulty, UUID categoryId, 
                                                       List<UUID> tagIds, Pageable pageable) {
        try {
        Page<ProblemPost> problemPosts = problemPostRepository.searchProblemPosts(
            query, language, difficulty, categoryId, tagIds, pageable);
        return problemPosts.map(this::mapToResponse);
        } catch (Exception e) {
            System.out.println("Error searching problem posts: " + e.getMessage());
            return Page.empty();
        }
    }

    @Transactional
    public ProblemPostResponse updateProblemPost(UUID id, UpdateProblemPostRequest request, User currentUser) {
        ProblemPost problemPost = problemPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));

        if (!problemPost.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own posts");
        }

        problemPost.setTitle(request.getTitle());
        problemPost.setDescription(request.getDescription());
        problemPost.setCode(request.getCode());
        problemPost.setLanguage(request.getLanguage());
        problemPost.setDifficultyLevel(request.getDifficultyLevel());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
            problemPost.setCategory(category);
        } else {
            problemPost.setCategory(null);
        }

        problemPost.getTags().clear();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (UUID tagId : request.getTagIds()) {
                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag not found: " + tagId));
                tags.add(tag);
            }
            problemPost.setTags(tags);
        }

        ProblemPost updatedPost = problemPostRepository.save(problemPost);
        return mapToResponse(updatedPost);
    }

    @Transactional
    public void deleteProblemPost(UUID id, User currentUser) {
        ProblemPost problemPost = problemPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));

        if (!problemPost.getUser().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().name().equals("ADMIN") &&
                !currentUser.getRole().name().equals("INSTRUCTOR")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete this post");
        }

        problemPostRepository.delete(problemPost);
    }

    private ProblemPostResponse mapToResponse(ProblemPost problemPost) {
        ProblemPostResponse response = new ProblemPostResponse();
        response.setId(problemPost.getId());
        response.setTitle(problemPost.getTitle());
        response.setDescription(problemPost.getDescription());
        response.setCode(problemPost.getCode());
        response.setLanguage(problemPost.getLanguage());
        response.setDifficultyLevel(problemPost.getDifficultyLevel());
        response.setCreatedAt(problemPost.getCreatedAt());
        response.setUpdatedAt(problemPost.getUpdatedAt());

        // Map category
        if (problemPost.getCategory() != null) {
            CategoryResponse categoryResponse = new CategoryResponse();
            categoryResponse.setId(problemPost.getCategory().getId());
            categoryResponse.setName(problemPost.getCategory().getName());
            categoryResponse.setDescription(problemPost.getCategory().getDescription());
            categoryResponse.setColor(problemPost.getCategory().getColor());
            response.setCategory(categoryResponse);
        }

        // Map tags
        if (problemPost.getTags() != null && !problemPost.getTags().isEmpty()) {
            List<TagResponse> tagResponses = problemPost.getTags().stream()
                    .map(tag -> {
                        TagResponse tagResponse = new TagResponse();
                        tagResponse.setId(tag.getId());
                        tagResponse.setName(tag.getName());
                        tagResponse.setDescription(tag.getDescription());
                        tagResponse.setColor(tag.getColor());
                        return tagResponse;
                    })
                    .collect(Collectors.toList());
            response.setTags(tagResponses);
        } else {
            response.setTags(new ArrayList<>());
        }

        User author = problemPost.getUser();
        ProblemPostResponse.UserInfo authorInfo = new ProblemPostResponse.UserInfo();
        authorInfo.setId(author.getId());
        authorInfo.setFirstName(author.getFirstName());
        authorInfo.setLastName(author.getLastName());
        authorInfo.setEmail(author.getEmail());
        response.setAuthor(authorInfo);

        return response;
    }
}
