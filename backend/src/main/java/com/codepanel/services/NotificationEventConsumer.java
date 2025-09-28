package com.codepanel.services;

import com.codepanel.config.NotificationRabbitConfig;
import com.codepanel.models.Notification;
import com.codepanel.models.events.AssignmentGradedEvent;
import com.codepanel.models.events.CommentCreatedEvent;
import com.codepanel.models.events.EmailNotificationEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventConsumer {

    private final NotificationService notificationService;
    private final NotificationEventPublisher notificationEventPublisher;
    // private final EmailService emailService;
    private final WebSocketNotificationService webSocketService;

    public NotificationEventConsumer(NotificationService notificationService,
            NotificationEventPublisher notificationEventPublisher,
            // EmailService emailService,
            WebSocketNotificationService webSocketService) {
        this.notificationService = notificationService;
        this.notificationEventPublisher = notificationEventPublisher;
        // this.emailService = emailService;
        this.webSocketService = webSocketService;
    }

    @RabbitListener(queues = NotificationRabbitConfig.COMMENT_NOTIFICATION_QUEUE)
    public void handleCommentCreatedEvent(CommentCreatedEvent event) {
        try {
            System.out.println("Processing comment created event: " + event);

            Notification notification = notificationService.createCommentNotification(event);

            if (notification != null) {
                System.out.println("Successfully created notification with ID: " + notification.getId() +
                        " for comment: " + event.getCommentId());

                // Send real-time WebSocket notification
                webSocketService.sendNotificationToUser(event.getPostAuthorId(), notification);

                // Update unread count
                Long unreadCount = notificationService.getUnreadCount(notification.getRecipient());
                webSocketService.sendUnreadCountToUser(event.getPostAuthorId(), unreadCount);
            } else {
                System.out.println("No notification created for comment event: " + event);
            }

        } catch (Exception e) {
            System.out.println("Failed to process comment created event: " + event + ", error: " + e.getMessage());
            throw e;
        }
    }

    @RabbitListener(queues = NotificationRabbitConfig.ASSIGNMENT_NOTIFICATION_QUEUE)
    public void handleAssignmentGradedEvent(AssignmentGradedEvent event) {
        try {
            System.out.println("Processing assignment graded event: " + event);

            Notification notification = notificationService.createAssignmentGradedNotification(event);

            if (notification != null) {
                System.out
                        .println("Successfully created notification for graded assignment: " + event.getSubmissionId());

                // Send real-time WebSocket notification
                webSocketService.sendNotificationToUser(event.getStudentId(), notification);

                // Update unread count
                Long unreadCount = notificationService.getUnreadCount(notification.getRecipient());
                webSocketService.sendUnreadCountToUser(event.getStudentId(), unreadCount);
            } else {
                System.out.println("No notification created for graded assignment event: " + event);
            }

        } catch (Exception e) {
            System.out.println("Failed to process assignment graded event: " + event + ", error: " + e.getMessage());
            throw e;
        }
    }

    // @RabbitListener(queues = NotificationRabbitConfig.EMAIL_NOTIFICATION_QUEUE)
    // public void handleEmailNotificationEvent(EmailNotificationEvent event) {
    //     try {
    //         System.out.println("Processing email notification event for: " + event.getRecipientEmail());

    //         emailService.sendTemplatedEmail(
    //                 event.getRecipientEmail(),
    //                 event.getSubject(),
    //                 event.getTemplateName(),
    //                 event.getTemplateVariables());

    //         System.out.println("Successfully sent email to: " + event.getRecipientEmail());

    //     } catch (Exception e) {
    //         System.out.println("Failed to send email notification: " + event + ", error: " + e.getMessage());
    //         throw e;
    //     }
    // }
}
