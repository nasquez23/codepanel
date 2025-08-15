package com.codepanel.services;

import com.codepanel.models.ProblemPost;
import com.codepanel.models.User;
import com.codepanel.models.dto.CreateProblemPostRequest;
import com.codepanel.models.dto.ProblemPostResponse;
import com.codepanel.repositories.ProblemPostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ProblemPostService {

    private final ProblemPostRepository problemPostRepository;

    public ProblemPostService(ProblemPostRepository problemPostRepository) {
        this.problemPostRepository = problemPostRepository;
    }

    public ProblemPostResponse createProblemPost(CreateProblemPostRequest request, User currentUser) {
        ProblemPost problemPost = new ProblemPost();
        problemPost.setTitle(request.getTitle());
        problemPost.setDescription(request.getDescription());
        problemPost.setCode(request.getCode());
        problemPost.setLanguage(request.getLanguage());
        problemPost.setUser(currentUser);

        ProblemPost savedPost = problemPostRepository.save(problemPost);
        return mapToResponse(savedPost);
    }

    public Page<ProblemPostResponse> getAllProblemPosts(Pageable pageable) {
        Page<ProblemPost> problemPosts = problemPostRepository.findAll(pageable);
        return problemPosts.map(this::mapToResponse);
    }

    public ProblemPostResponse getProblemPostById(UUID id) {
        ProblemPost problemPost = problemPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));
        return mapToResponse(problemPost);
    }

    public Page<ProblemPostResponse> getProblemPostsByUser(User user, Pageable pageable) {
        Page<ProblemPost> problemPosts = problemPostRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return problemPosts.map(this::mapToResponse);
    }

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
        response.setCreatedAt(problemPost.getCreatedAt());
        response.setUpdatedAt(problemPost.getUpdatedAt());

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
