package com.codepanel.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.name}")
    private String appName;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendTemplatedEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, appName);
            helper.setTo(to);
            helper.setSubject(subject);

            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(templateName, context);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);

        } catch (MessagingException e) {
            System.err.println("Failed to send email to: " + to + ", error: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        } catch (Exception e) {
            System.err.println("Unexpected error sending email to: " + to + ", error: " + e.getMessage());
            throw new RuntimeException("Unexpected error sending email", e);
        }
    }

    public void sendCommentNotificationEmail(String to, String recipientName, String commenterName, 
                                           String postTitle, String commentContent, String postUrl) {
        Map<String, Object> variables = Map.of(
            "recipientName", recipientName,
            "commenterName", commenterName,
            "postTitle", postTitle,
            "commentContent", commentContent,
            "postUrl", postUrl,
            "appName", appName
        );

        sendTemplatedEmail(to, "New comment on your post - " + appName, "comment-notification", variables);
    }

    public void sendAssignmentCreatedEmail(String to, String recipientName, String instructorName, 
                                         String assignmentTitle, String dueDate, String assignmentUrl) {
        Map<String, Object> variables = Map.of(
            "recipientName", recipientName,
            "instructorName", instructorName,
            "assignmentTitle", assignmentTitle,
            "dueDate", dueDate,
            "assignmentUrl", assignmentUrl,
            "appName", appName
        );

        sendTemplatedEmail(to, "New assignment: " + assignmentTitle + " - " + appName, "assignment-created", variables);
    }

    public void sendAssignmentDueReminderEmail(String to, String recipientName, String assignmentTitle, 
                                             String dueDate, String hoursRemaining, String assignmentUrl) {
        Map<String, Object> variables = Map.of(
            "recipientName", recipientName,
            "assignmentTitle", assignmentTitle,
            "dueDate", dueDate,
            "hoursRemaining", hoursRemaining,
            "assignmentUrl", assignmentUrl,
            "appName", appName
        );

        sendTemplatedEmail(to, "Assignment due soon: " + assignmentTitle + " - " + appName, "assignment-due-reminder", variables);
    }

    public void sendAssignmentGradedEmail(String to, String recipientName, String assignmentTitle, 
                                        String score, String comment, String submissionUrl) {
        Map<String, Object> variables = Map.of(
            "recipientName", recipientName,
            "assignmentTitle", assignmentTitle,
            "score", score,
            "comment", comment != null ? comment : "No additional comments",
            "submissionUrl", submissionUrl,
            "appName", appName
        );

        sendTemplatedEmail(to, "Assignment graded: " + assignmentTitle + " - " + appName, "assignment-graded", variables);
    }
}
