package com.codepanel.services;

import com.codepanel.models.CommentReaction;
import com.codepanel.models.ProblemPost;
import com.codepanel.models.ProblemPostComment;
import com.codepanel.models.User;
import com.codepanel.models.dto.CommentResponse;
import com.codepanel.models.dto.CreateCommentRequest;
import com.codepanel.models.dto.UpdateCommentRequest;
import com.codepanel.models.dto.GamificationEvent;
import com.codepanel.models.enums.ReactionType;
import com.codepanel.models.enums.ScoreEventType;
import com.codepanel.models.events.CommentCreatedEvent;
import com.codepanel.services.GamificationEventPublisher;
import com.codepanel.repositories.CommentReactionRepository;
import com.codepanel.repositories.ProblemPostCommentRepository;
import com.codepanel.repositories.ProblemPostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    private final ProblemPostCommentRepository commentRepository;
    private final ProblemPostRepository problemPostRepository;
    private final CommentReactionRepository reactionRepository;
    private final NotificationEventPublisher notificationEventPublisher;
    private final GamificationEventPublisher gamificationEventPublisher;

    public CommentService(ProblemPostCommentRepository commentRepository,
            ProblemPostRepository problemPostRepository,
            CommentReactionRepository reactionRepository,
            NotificationEventPublisher notificationEventPublisher,
            GamificationEventPublisher gamificationEventPublisher) {
        this.commentRepository = commentRepository;
        this.problemPostRepository = problemPostRepository;
        this.reactionRepository = reactionRepository;
        this.notificationEventPublisher = notificationEventPublisher;
        this.gamificationEventPublisher = gamificationEventPublisher;
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

        // Publish comment created event for notifications
        CommentCreatedEvent event = CommentCreatedEvent.builder()
                .commentId(savedComment.getId())
                .problemPostId(problemPost.getId())
                .problemPostTitle(problemPost.getTitle())
                .commentAuthorId(currentUser.getId())
                .commentAuthorName(currentUser.getFirstName() + " " + currentUser.getLastName())
                .postAuthorId(problemPost.getUser().getId())
                .commentContent(savedComment.getComment())
                .createdAt(savedComment.getCreatedAt())
                .build();

        notificationEventPublisher.publishCommentCreated(event);

        return mapToResponse(savedComment, currentUser);
    }

    public Page<CommentResponse> getCommentsByProblemPost(UUID problemPostId, Pageable pageable, User currentUser) {
        ProblemPost problemPost = problemPostRepository.findById(problemPostId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem post not found"));

        Page<ProblemPostComment> comments = commentRepository.findByProblemPostOrderByCreatedAtDesc(problemPost,
                pageable);
        return comments.map(comment -> mapToResponse(comment, currentUser));
    }

    public Page<CommentResponse> getCommentsByUser(User user, Pageable pageable, User currentUser) {
        Page<ProblemPostComment> comments = commentRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return comments.map(comment -> mapToResponse(comment, currentUser));
    }

    public CommentResponse getCommentById(UUID commentId, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        return mapToResponse(comment, currentUser);
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
        return mapToResponse(updatedComment, currentUser);
    }

    public void deleteComment(UUID commentId, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public CommentResponse toggleReaction(UUID commentId, ReactionType reactionType, User currentUser) {
        ProblemPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        Optional<CommentReaction> existingReaction = reactionRepository.findByCommentAndUser(comment, currentUser);

        if (existingReaction.isPresent()) {
            CommentReaction reaction = existingReaction.get();
            if (reaction.getReactionType() == reactionType) {
                reactionRepository.delete(reaction);
                updateCommentCounts(comment);
            } else {
                reaction.setReactionType(reactionType);
                reactionRepository.save(reaction);
                updateCommentCounts(comment);
            }
        } else {
            CommentReaction newReaction = new CommentReaction();
            newReaction.setComment(comment);
            newReaction.setUser(currentUser);
            newReaction.setReactionType(reactionType);
            reactionRepository.save(newReaction);
            updateCommentCounts(comment);
        }

        comment = commentRepository.findById(commentId).orElseThrow();

        ScoreEventType eventType = reactionType == ReactionType.LIKE ? ScoreEventType.COMMENT_LIKED
                : ScoreEventType.COMMENT_DISLIKED;

        try {
            gamificationEventPublisher.publish(
                    eventType,
                    GamificationEvent.builder()
                            .eventType(eventType)
                            .userId(comment.getUser().getId())
                            .difficulty(null)
                            .refType("COMMENT")
                            .refId(comment.getId())
                            .build());
        } catch (Exception ignored) {
            System.out.println(
                    "Error publishing gamification event for comment " + eventType + ": " + ignored.getMessage());
        }

        return mapToResponse(comment, currentUser);
    }

    private void updateCommentCounts(ProblemPostComment comment) {
        Long likes = reactionRepository.countByCommentIdAndReactionType(comment.getId(), ReactionType.LIKE);
        Long dislikes = reactionRepository.countByCommentIdAndReactionType(comment.getId(), ReactionType.DISLIKE);

        comment.setLikes(likes.intValue());
        comment.setDislikes(dislikes.intValue());
        commentRepository.save(comment);
    }

    public Long getCommentCount(UUID problemPostId) {
        return commentRepository.countByProblemPostId(problemPostId);
    }

    private CommentResponse mapToResponse(ProblemPostComment comment, User currentUser) {
        CommentResponse.UserInfo userInfo = new CommentResponse.UserInfo();
        userInfo.setId(comment.getUser().getId());
        userInfo.setFirstName(comment.getUser().getFirstName());
        userInfo.setLastName(comment.getUser().getLastName());
        userInfo.setEmail(comment.getUser().getEmail());

        ReactionType userReaction = null;
        if (currentUser != null) {
            Optional<CommentReaction> reaction = reactionRepository.findByCommentAndUser(comment, currentUser);
            if (reaction.isPresent()) {
                userReaction = reaction.get().getReactionType();
            }
        }

        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setComment(comment.getComment());
        response.setCode(comment.getCode());
        response.setLikes(comment.getLikes());
        response.setDislikes(comment.getDislikes());
        response.setAuthor(userInfo);
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        response.setUserReaction(userReaction);

        return response;
    }
}
