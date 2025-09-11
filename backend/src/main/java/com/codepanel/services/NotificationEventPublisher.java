package com.codepanel.services;

import com.codepanel.config.NotificationRabbitConfig;
import com.codepanel.models.events.AssignmentGradedEvent;
import com.codepanel.models.events.CommentCreatedEvent;
import com.codepanel.models.events.EmailNotificationEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public NotificationEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishCommentCreated(CommentCreatedEvent event) {
        try {
            System.out.println("Publishing comment created event for comment ID: " + event.getCommentId());
            rabbitTemplate.convertAndSend(
                    NotificationRabbitConfig.NOTIFICATIONS_EXCHANGE,
                    NotificationRabbitConfig.COMMENT_CREATED_ROUTING_KEY,
                    event);
        } catch (Exception e) {
            System.out.println("Failed to publish comment created event: " + e.getMessage());
        }
    }

    // public void publishAssignmentDue(AssignmentDueEvent event) {
    //     try {
    //         System.out.println("Publishing assignment due event for assignment ID: " + event.getAssignmentId());
    //         rabbitTemplate.convertAndSend(
    //                 NotificationRabbitConfig.NOTIFICATIONS_EXCHANGE,
    //                 NotificationRabbitConfig.ASSIGNMENT_DUE_ROUTING_KEY,
    //                 event);
    //     } catch (Exception e) {
    //         System.out.println("Failed to publish assignment due event: " + e.getMessage());
    //     }
    // }

    public void publishAssignmentGraded(AssignmentGradedEvent event) {
        try {
            System.out.println("Publishing assignment graded event for submission ID: " + event.getSubmissionId());
            rabbitTemplate.convertAndSend(
                    NotificationRabbitConfig.NOTIFICATIONS_EXCHANGE,
                    NotificationRabbitConfig.ASSIGNMENT_GRADED_ROUTING_KEY,
                    event);
        } catch (Exception e) {
            System.out.println("Failed to publish assignment graded event: " + e.getMessage());
        }
    }

    public void publishEmailNotification(EmailNotificationEvent event) {
        try {
            System.out.println("Publishing email notification event for recipient: " + event.getRecipientEmail());
            rabbitTemplate.convertAndSend(
                    NotificationRabbitConfig.NOTIFICATIONS_EXCHANGE,
                    NotificationRabbitConfig.EMAIL_NOTIFICATION_ROUTING_KEY,
                    event);
        } catch (Exception e) {
            System.out.println("Failed to publish email notification event: " + e.getMessage());
        }
    }
}
