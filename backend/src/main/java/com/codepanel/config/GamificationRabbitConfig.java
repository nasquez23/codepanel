package com.codepanel.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GamificationRabbitConfig {
	public static final String EXCHANGE = "domain.events";
	public static final String QUEUE = "gamification.events";
	public static final String RK_SUBMISSION_ACCEPTED = "submission.accepted";
	public static final String RK_REVIEW_APPROVED = "review.approved";
	public static final String RK_PROBLEM_ACCEPTED = "problem.accepted";
	public static final String RK_COMMENT_CREATED = "comment.created";
	public static final String RK_COMMENT_LIKED = "comment.liked";
	public static final String RK_COMMENT_DISLIKED = "comment.disliked";
	public static final String RK_PROBLEM_ANSWER_ACCEPTED = "problem.answer.accepted";
	public static final String RK_PROBLEM_ANSWER_UNACCEPTED = "problem.answer.unaccepted";
	public static final String RK_PROBLEM_POSTED = "problem.posted";
	public static final String RK_ACHIEVEMENT_AWARDED = "achievement.awarded";

	@Bean
	public TopicExchange domainEventsExchange() {
		return new TopicExchange(EXCHANGE, true, false);
	}

	@Bean
	public Queue gamificationQueue() {
		return QueueBuilder.durable(QUEUE).build();
	}

	@Bean
	public Binding bindSubmissionAccepted(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_SUBMISSION_ACCEPTED);
	}

	@Bean
	public Binding bindReviewApproved(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_REVIEW_APPROVED);
	}

	@Bean
	public Binding bindProblemAccepted(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_PROBLEM_ACCEPTED);
	}

	@Bean
	public Binding bindCommentCreated(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_COMMENT_CREATED);
	}

	@Bean
	public Binding bindCommentUpvoted(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_COMMENT_LIKED);
	}

	@Bean
	public Binding bindCommentDisliked(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_COMMENT_DISLIKED);
	}

	@Bean
	public Binding bindProblemAnswerAccepted(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_PROBLEM_ANSWER_ACCEPTED);
	}

	@Bean
	public Binding bindProblemAnswerUnaccepted(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_PROBLEM_ANSWER_UNACCEPTED);
	}

	@Bean
	public Binding bindProblemPosted(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_PROBLEM_POSTED);
	}

	@Bean
	public Binding bindAchievementAwarded(Queue gamificationQueue, TopicExchange domainEventsExchange) {
		return BindingBuilder.bind(gamificationQueue).to(domainEventsExchange).with(RK_ACHIEVEMENT_AWARDED);
	}

	@Bean
	public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}
}
