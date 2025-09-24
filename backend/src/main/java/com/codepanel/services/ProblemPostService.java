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
import com.codepanel.models.dto.ProblemPostsPageSlice;
import com.codepanel.models.enums.DifficultyLevel;
import com.codepanel.models.enums.ProgrammingLanguage;
import com.codepanel.models.ProblemPostComment;
import com.codepanel.models.dto.GamificationEvent;
import com.codepanel.models.enums.ScoreEventType;
import com.codepanel.repositories.CategoryRepository;
import com.codepanel.repositories.TagRepository;
import com.codepanel.repositories.ProblemPostRepository;
import com.codepanel.repositories.ProblemPostCommentRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProblemPostService {

    private final ProblemPostRepository problemPostRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ProblemPostCommentRepository problemPostCommentRepository;
    private final GamificationEventPublisher gamificationEventPublisher;

    public ProblemPostService(ProblemPostRepository problemPostRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository,
            ProblemPostCommentRepository problemPostCommentRepository,
            GamificationEventPublisher gamificationEventPublisher) {
        this.problemPostRepository = problemPostRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.problemPostCommentRepository = problemPostCommentRepository;
        this.gamificationEventPublisher = gamificationEventPublisher;
    }

    @CacheEvict(cacheNames = "problemPostsByPage", allEntries = true)
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
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Tag not found: " + tagId));
                tags.add(tag);
            }
            problemPost.setTags(tags);
        }

        ProblemPost savedPost = problemPostRepository.save(problemPost);

        gamificationEventPublisher.publish(
                ScoreEventType.PROBLEM_POSTED,
                GamificationEvent.builder()
                        .eventType(ScoreEventType.PROBLEM_POSTED)
                        .userId(currentUser.getId())
                        .difficulty(problemPost.getDifficultyLevel())
                        .refType("PROBLEM_POSTED")
                        .refId(savedPost.getId())
                        .build());

        return mapToResponse(savedPost);
    }

    @Cacheable(cacheNames = "problemPostsByPage", key = "T(String).format('%d:%d:%s', #pageable.pageNumber, #pageable.pageSize, #pageable.sort)")
    public ProblemPostsPageSlice getAllProblemPosts(Pageable pageable) {
        Page<ProblemPost> problemPosts = problemPostRepository.findAllWithRelations(pageable);
        List<ProblemPostResponse> content = problemPosts.map(this::mapToResponse).getContent();
        return new ProblemPostsPageSlice(content, problemPosts.getTotalElements());
    }

    @Cacheable(cacheNames = "problemPostById", key = "#id")
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
    @CacheEvict(cacheNames = "problemPostsByPage", allEntries = true)
    public ProblemPostResponse acceptAnswer(UUID postId, UUID commentId, User currentUser) {
        ProblemPost problemPost = problemPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));
        ProblemPostComment comment = problemPostCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!problemPost.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to accept this answer");
        }

        if (!problemPost.getId().equals(comment.getProblemPost().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment does not belong to this post");
        }

        if (problemPost.getAcceptedAnswer() != null && problemPost.getAcceptedAnswer().getId().equals(commentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment is already the accepted answer");
        }

        if (problemPost.getUser().getId().equals(comment.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can't accept your own answer");
        }

        if (problemPost.getAcceptedAnswer() != null) {
            // Remove points from the old accepted answer
            gamificationEventPublisher.publish(
                    ScoreEventType.PROBLEM_ANSWER_UNACCEPTED,
                    GamificationEvent.builder()
                            .eventType(ScoreEventType.PROBLEM_ANSWER_UNACCEPTED)
                            .userId(problemPost.getAcceptedAnswer().getUser().getId())
                            .difficulty(problemPost.getAcceptedAnswer().getProblemPost().getDifficultyLevel())
                            .refType("PROBLEM_ANSWER_UNACCEPTED")
                            .refId(problemPost.getAcceptedAnswer().getId())
                            .build());
        }

        gamificationEventPublisher.publish(
                ScoreEventType.PROBLEM_ANSWER_ACCEPTED,
                GamificationEvent.builder()
                        .eventType(ScoreEventType.PROBLEM_ANSWER_ACCEPTED)
                        .userId(comment.getUser().getId())
                        .difficulty(problemPost.getDifficultyLevel())
                        .refType("PROBLEM_ANSWER_ACCEPTED")
                        .refId(commentId)
                        .build());

        problemPost.setAcceptedAnswer(comment);
        System.out.println("accepted answer: " + problemPost.getAcceptedAnswer().getId());

        problemPostRepository.save(problemPost);
        System.out.println("Problem post saved: " + problemPost);

        return mapToResponse(problemPost);
    }

    @Transactional
    @CacheEvict(cacheNames = "problemPostsByPage", allEntries = true)
    public void unacceptAnswer(UUID postId, User currentUser) {
        ProblemPost problemPost = problemPostRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));

        if (!problemPost.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to accept this answer");
        }

        if (problemPost.getAcceptedAnswer() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No accepted answer found");
        }

        gamificationEventPublisher.publish(
                ScoreEventType.PROBLEM_ANSWER_UNACCEPTED,
                GamificationEvent.builder()
                        .eventType(ScoreEventType.PROBLEM_ANSWER_UNACCEPTED)
                        .userId(problemPost.getAcceptedAnswer().getUser().getId())
                        .difficulty(problemPost.getAcceptedAnswer().getProblemPost().getDifficultyLevel())
                        .refType("PROBLEM_ANSWER_UNACCEPTED")
                        .refId(problemPost.getAcceptedAnswer().getId())
                        .build());

        problemPost.setAcceptedAnswer(null);
        problemPostRepository.save(problemPost);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "problemPostById", key = "#id"),
            @CacheEvict(cacheNames = "problemPostsByPage", allEntries = true)
    })
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
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag not found: " + tagId));
                tags.add(tag);
            }
            problemPost.setTags(tags);
        }

        ProblemPost updatedPost = problemPostRepository.save(problemPost);
        return mapToResponse(updatedPost);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "problemPostById", key = "#id"),
            @CacheEvict(cacheNames = "problemPostsByPage", allEntries = true)
    })
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
        authorInfo.setProfilePictureUrl(author.getProfilePictureUrl());
        response.setAuthor(authorInfo);

        Long commentCount = problemPostRepository.countCommentsByProblemPostId(problemPost.getId());
        response.setCommentCount(commentCount);

        // Map accepted answer if it exists
        if (problemPost.getAcceptedAnswer() != null) {
            ProblemPostComment acceptedComment = problemPost.getAcceptedAnswer();
            ProblemPostResponse.AcceptedAnswer acceptedAnswer = new ProblemPostResponse.AcceptedAnswer();
            acceptedAnswer.setId(acceptedComment.getId());
            acceptedAnswer.setComment(acceptedComment.getComment());
            acceptedAnswer.setCode(acceptedComment.getCode());
            acceptedAnswer.setCreatedAt(acceptedComment.getCreatedAt());

            ProblemPostResponse.UserInfo acceptedAuthorInfo = new ProblemPostResponse.UserInfo();
            acceptedAuthorInfo.setId(acceptedComment.getUser().getId());
            acceptedAuthorInfo.setFirstName(acceptedComment.getUser().getFirstName());
            acceptedAuthorInfo.setLastName(acceptedComment.getUser().getLastName());
            acceptedAuthorInfo.setEmail(acceptedComment.getUser().getEmail());
            acceptedAuthorInfo.setProfilePictureUrl(acceptedComment.getUser().getProfilePictureUrl());
            acceptedAnswer.setAuthor(acceptedAuthorInfo);

            response.setAcceptedAnswer(acceptedAnswer);
        }

        return response;
    }
}
