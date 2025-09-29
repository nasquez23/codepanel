package com.codepanel.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class NotificationRabbitConfig {
    public static final String NOTIFICATIONS_EXCHANGE = "notifications.exchange";
    public static final String NOTIFICATIONS_DLX = "notifications.dlx";

    public static final String COMMENT_NOTIFICATION_QUEUE = "notifications.comments";
    public static final String COMMENT_NOTIFICATION_DLQ = "notifications.comments.dlq";
    public static final String ASSIGNMENT_NOTIFICATION_QUEUE = "notifications.assignments";
    public static final String ASSIGNMENT_NOTIFICATION_DLQ = "notifications.assignments.dlq";
    public static final String ACHIEVEMENT_NOTIFICATION_QUEUE = "notifications.achievements";
    public static final String ACHIEVEMENT_NOTIFICATION_DLQ = "notifications.achievements.dlq";
    public static final String EMAIL_NOTIFICATION_QUEUE = "notifications.email";
    public static final String EMAIL_NOTIFICATION_DLQ = "notifications.email.dlq";

    public static final String COMMENT_CREATED_ROUTING_KEY = "comment.created";
    public static final String ASSIGNMENT_CREATED_ROUTING_KEY = "assignment.created";
    public static final String ASSIGNMENT_DUE_ROUTING_KEY = "assignment.due";
    public static final String ASSIGNMENT_GRADED_ROUTING_KEY = "assignment.graded";
    public static final String ASSIGNMENT_SUBMITTED_ROUTING_KEY = "assignment.submitted";
    public static final String ACHIEVEMENT_AWARDED_ROUTING_KEY = "achievement.awarded";
    public static final String EMAIL_NOTIFICATION_ROUTING_KEY = "email.send";

    @Bean
    public TopicExchange notificationsExchange() {
        return new TopicExchange(NOTIFICATIONS_EXCHANGE, true, false);
    }

    @Bean
    public DirectExchange notificationsDeadLetterExchange() {
        return new DirectExchange(NOTIFICATIONS_DLX, true, false);
    }

    @Bean
    public Queue commentNotificationQueue() {
        return QueueBuilder
                .durable(COMMENT_NOTIFICATION_QUEUE)
                .withArgument("x-dead-letter-exchange", NOTIFICATIONS_DLX)
                .withArgument("x-dead-letter-routing-key", COMMENT_NOTIFICATION_DLQ)
                .withArgument("x-message-ttl", 3600000)
                .build();
    }

    @Bean
    public Queue commentNotificationDeadLetterQueue() {
        return QueueBuilder.durable(COMMENT_NOTIFICATION_DLQ).build();
    }

    @Bean
    public Queue assignmentNotificationQueue() {
        return QueueBuilder
                .durable(ASSIGNMENT_NOTIFICATION_QUEUE)
                .withArgument("x-dead-letter-exchange", NOTIFICATIONS_DLX)
                .withArgument("x-dead-letter-routing-key", ASSIGNMENT_NOTIFICATION_DLQ)
                .withArgument("x-message-ttl", 3600000)
                .build();
    }

    @Bean
    public Queue assignmentNotificationDeadLetterQueue() {
        return QueueBuilder.durable(ASSIGNMENT_NOTIFICATION_DLQ).build();
    }

    @Bean
    public Queue achievementNotificationQueue() {
        return QueueBuilder
                .durable(ACHIEVEMENT_NOTIFICATION_QUEUE)
                .withArgument("x-dead-letter-exchange", NOTIFICATIONS_DLX)
                .withArgument("x-dead-letter-routing-key", ACHIEVEMENT_NOTIFICATION_DLQ)
                .withArgument("x-message-ttl", 3600000)
                .build();
    }

    @Bean
    public Queue achievementNotificationDeadLetterQueue() {
        return QueueBuilder.durable(ACHIEVEMENT_NOTIFICATION_DLQ).build();
    }

    @Bean
    public Queue emailNotificationQueue() {
        return QueueBuilder
                .durable(EMAIL_NOTIFICATION_QUEUE)
                .withArgument("x-dead-letter-exchange", NOTIFICATIONS_DLX)
                .withArgument("x-dead-letter-routing-key", EMAIL_NOTIFICATION_DLQ)
                .withArgument("x-message-ttl", 7200000)
                .build();
    }

    @Bean
    public Queue emailNotificationDeadLetterQueue() {
        return QueueBuilder.durable(EMAIL_NOTIFICATION_DLQ).build();
    }

    @Bean
    public Binding commentNotificationBinding() {
        return BindingBuilder
                .bind(commentNotificationQueue())
                .to(notificationsExchange())
                .with("comment.*");
    }

    @Bean
    public Binding assignmentNotificationBinding() {
        return BindingBuilder
                .bind(assignmentNotificationQueue())
                .to(notificationsExchange())
                .with("assignment.*");
    }

    @Bean
    public Binding achievementNotificationBinding() {
        return BindingBuilder
                .bind(achievementNotificationQueue())
                .to(notificationsExchange())
                .with("achievement.*");
    }

    @Bean
    public Binding emailNotificationBinding() {
        return BindingBuilder
                .bind(emailNotificationQueue())
                .to(notificationsExchange())
                .with("email.*");
    }

    @Bean
    public Binding commentNotificationDeadLetterBinding() {
        return BindingBuilder
                .bind(commentNotificationDeadLetterQueue())
                .to(notificationsDeadLetterExchange())
                .with(COMMENT_NOTIFICATION_DLQ);
    }

    @Bean
    public Binding assignmentNotificationDeadLetterBinding() {
        return BindingBuilder
                .bind(assignmentNotificationDeadLetterQueue())
                .to(notificationsDeadLetterExchange())
                .with(ASSIGNMENT_NOTIFICATION_DLQ);
    }

    @Bean
    public Binding achievementNotificationDeadLetterBinding() {
        return BindingBuilder
                .bind(achievementNotificationDeadLetterQueue())
                .to(notificationsDeadLetterExchange())
                .with(ACHIEVEMENT_NOTIFICATION_DLQ);
    }

    @Bean
    public Binding emailNotificationDeadLetterBinding() {
        return BindingBuilder
                .bind(emailNotificationDeadLetterQueue())
                .to(notificationsDeadLetterExchange())
                .with(EMAIL_NOTIFICATION_DLQ);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
