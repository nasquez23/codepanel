package com.codepanel.services;

import com.codepanel.models.ProblemPost;
import com.codepanel.models.ProblemPostComment;
import com.codepanel.models.User;
import com.codepanel.models.dto.CommentResponse;
import com.codepanel.models.dto.CreateCommentRequest;
import com.codepanel.models.dto.UpdateCommentRequest;
import com.codepanel.repositories.ProblemPostCommentRepository;
import com.codepanel.repositories.ProblemPostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class CommentService {

    private final ProblemPostCommentRepository commentRepository;
    private final ProblemPostRepository problemPostRepository;

    public CommentService(ProblemPostCommentRepository commentRepository, 
                         ProblemPostRepository problemPostRepository) {
        this.commentRepository = commentRepository;
        this.problemPostRepository = problemPostRepository;
    }

    public CommentResponse createComment(UUID problemPostId, CreateCommentRequest request, User currentUser) {
        ProblemPost problemPost = problemPostRepository.findById(problemPostId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));

        ProblemPostComment comment = new ProblemPostComment();
        comment.setComment(request.getComment());
        comment.setCode(request.getCode());
        comment.setProblemPost(problemPost);
        comment.setUser(currentUser);
        comment.setLikes(0);
        comment.setDislikes(0);

        ProblemPostComment savedComment = commentRepository.save(comment);
        return mapToResponse(savedComment);
    }

    public Page<CommentResponse> getCommentsByProblemPost(UUID problemPostId, Pageable pageable) {
        ProblemPost problemPost = problemPostRepository.findById(problemPostId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));

        Page<ProblemPostComment> comments = commentRepository.findByProblemPostOrderByCreatedAtDesc(problemPost, pageable);
        return comments.map(this::mapToResponse);
    }

    public Page<CommentResponse> getCommentsByUser(User user, Pageable pageable) {
        Page<ProblemPostComment> comments = commentRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return comments.map(this::mapToResponse);
    }

    public CommentResponse getCommentById(UUID commentId) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        return mapToResponse(comment);
    }

    public CommentResponse updateComment(UUID commentId, UpdateCommentRequest request, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own comments");
        }

        comment.setComment(request.getComment());
        comment.setCode(request.getCode());

        ProblemPostComment updatedComment = commentRepository.save(comment);
        return mapToResponse(updatedComment);
    }

    public void deleteComment(UUID commentId, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    public CommentResponse likeComment(UUID commentId, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        comment.setLikes(comment.getLikes() + 1);
        ProblemPostComment updatedComment = commentRepository.save(comment);
        return mapToResponse(updatedComment);
    }

    public CommentResponse dislikeComment(UUID commentId, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        comment.setDislikes(comment.getDislikes() + 1);
        ProblemPostComment updatedComment = commentRepository.save(comment);
        return mapToResponse(updatedComment);
    }

    public Long getCommentCount(UUID problemPostId) {
        return commentRepository.countByProblemPostId(problemPostId);
    }

    private CommentResponse mapToResponse(ProblemPostComment comment) {
        CommentResponse.UserInfo userInfo = new CommentResponse.UserInfo();
        userInfo.setId(comment.getUser().getId());
        userInfo.setFirstName(comment.getUser().getFirstName());
        userInfo.setLastName(comment.getUser().getLastName());
        userInfo.setEmail(comment.getUser().getEmail());

        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setComment(comment.getComment());
        response.setCode(comment.getCode());
        response.setLikes(comment.getLikes());
        response.setDislikes(comment.getDislikes());
        response.setAuthor(userInfo);
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());

        return response;
    }
}
