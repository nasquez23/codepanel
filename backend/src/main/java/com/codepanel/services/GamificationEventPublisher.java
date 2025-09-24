package com.codepanel.services;

import com.codepanel.config.GamificationRabbitConfig;
import com.codepanel.models.dto.GamificationEvent;
import com.codepanel.models.enums.ScoreEventType;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class GamificationEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public GamificationEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(ScoreEventType type, GamificationEvent payload) {
        String routingKey = switch (type) {
            case SUBMISSION_ACCEPTED -> GamificationRabbitConfig.RK_SUBMISSION_ACCEPTED;
            case REVIEW_APPROVED -> GamificationRabbitConfig.RK_REVIEW_APPROVED;
            case PROBLEM_ACCEPTED -> GamificationRabbitConfig.RK_PROBLEM_ACCEPTED;
            case COMMENT_LIKED -> GamificationRabbitConfig.RK_COMMENT_LIKED;
            case COMMENT_DISLIKED -> GamificationRabbitConfig.RK_COMMENT_DISLIKED;
            case PROBLEM_ANSWER_ACCEPTED -> GamificationRabbitConfig.RK_PROBLEM_ANSWER_ACCEPTED;
            case PROBLEM_ANSWER_UNACCEPTED -> GamificationRabbitConfig.RK_PROBLEM_ANSWER_UNACCEPTED;
            case PROBLEM_POSTED -> GamificationRabbitConfig.RK_PROBLEM_POSTED;
            case ACHIEVEMENT_AWARDED -> GamificationRabbitConfig.RK_ACHIEVEMENT_AWARDED;
        };
        rabbitTemplate.convertAndSend(GamificationRabbitConfig.EXCHANGE, routingKey, payload);
    }
}
