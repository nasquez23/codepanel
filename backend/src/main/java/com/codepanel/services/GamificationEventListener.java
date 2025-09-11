package com.codepanel.services;

import com.codepanel.config.GamificationRabbitConfig;
import com.codepanel.models.User;
import com.codepanel.models.dto.GamificationEvent;
import com.codepanel.repositories.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class GamificationEventListener {
    private final GamificationService gamificationService;
    private final UserRepository userRepository;

    public GamificationEventListener(GamificationService gamificationService,
            UserRepository userRepository) {
        this.gamificationService = gamificationService;
        this.userRepository = userRepository;
    }

    @RabbitListener(queues = GamificationRabbitConfig.QUEUE)
    public void onEvent(GamificationEvent event) {
        User user = userRepository.findById(event.getUserId()).orElse(null);
        if (user == null) {
            return;
        }
        int basePoints = switch (event.getEventType()) {
            case SUBMISSION_ACCEPTED -> 10;
            case REVIEW_APPROVED -> 5;
            case PROBLEM_ACCEPTED -> 0;
            case COMMENT_LIKED -> 2;
            case COMMENT_DISLIKED -> -2;
            case PROBLEM_ANSWER_ACCEPTED -> 10;
            case PROBLEM_ANSWER_UNACCEPTED -> -10;
            case PROBLEM_POSTED -> 0;
        };

        gamificationService.recordEvent(
                user,
                event.getEventType(),
                event.getDifficulty(),
                basePoints,
                event.getRefType(),
                event.getRefId());
    }
}
