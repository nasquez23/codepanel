package com.codepanel.services;

import com.codepanel.models.Notification;
import com.codepanel.models.User;
import com.codepanel.models.enums.NotificationType;
import com.codepanel.models.events.AssignmentGradedEvent;
import com.codepanel.models.events.CommentCreatedEvent;
import com.codepanel.repositories.NotificationRepository;
import com.codepanel.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Notification createCommentNotification(CommentCreatedEvent event) {
        System.out.println("Creating comment notification for event: " + event);
        
        if (event.getCommentAuthorId().equals(event.getPostAuthorId())) {
            System.out.println("Skipping notification - comment author is the same as post author");
            return null;
        }

        User recipient = userRepository.findById(event.getPostAuthorId())
                .orElseThrow(() -> new RuntimeException("Post author not found: " + event.getPostAuthorId()));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(NotificationType.COMMENT)
                .title("New comment on your problem post")
                .message(String.format("%s commented on your post \"%s\": %s", 
                        event.getCommentAuthorName(),
                        event.getProblemPostTitle(),
                        truncateMessage(event.getCommentContent(), 200)))
                .relatedEntityId(event.getProblemPostId())
                .relatedEntityType("PROBLEM_POST")
                .actionUrl("/problems/" + event.getProblemPostId())
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        System.out.println("Created notification with ID: " + savedNotification.getId());
        
        return savedNotification;
    }

    @Transactional
    public Notification createAssignmentGradedNotification(AssignmentGradedEvent event) {
        System.out.println("Creating assignment graded notification for event: " + event);
        
        User recipient = userRepository.findById(event.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + event.getStudentId()));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(NotificationType.ASSIGNMENT_GRADED)
                .title("Assignment graded")
                .message(String.format("Your assignment \"%s\" has been graded. Score: %d/100", 
                        event.getAssignmentTitle(),
                        event.getScore()))
                .relatedEntityId(event.getSubmissionId())
                .relatedEntityType("ASSIGNMENT_SUBMISSION")
                .actionUrl("/submissions/" + event.getSubmissionId())
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        System.out.println("Created assignment graded notification with ID: " + savedNotification.getId());
        
        return savedNotification;
    }

    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(User user, Pageable pageable) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Notification> getUnreadNotifications(User user, Pageable pageable) {
        return notificationRepository.findUnreadByRecipientOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(User user) {
        return notificationRepository.countUnreadByRecipient(user);
    }

    @Transactional
    public boolean markAsRead(UUID notificationId, User user) {
        int updated = notificationRepository.markAsReadById(notificationId, user);
        return updated > 0;
    }

    @Transactional
    public int markAllAsRead(User user) {
        return notificationRepository.markAllAsReadByRecipient(user);
    }

    private String truncateMessage(String message, int maxLength) {
        if (message == null) {
            return "";
        }
        if (message.length() <= maxLength) {
            return message;
        }
        return message.substring(0, maxLength - 3) + "...";
    }
}
