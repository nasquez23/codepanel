package com.codepanel.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class WebSocketController {

    @MessageMapping("/connect")
    @SendToUser("/queue/connection")
    public Map<String, String> handleConnection(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String userId = principal != null ? principal.getName() : "anonymous";
            System.out.println("WebSocket connection established for user: " + userId);

            // Store user session information
            headerAccessor.getSessionAttributes().put("userId", userId);

            return Map.of(
                    "status", "connected",
                    "userId", userId,
                    "message", "WebSocket connection established successfully");

        } catch (Exception e) {
            System.err.println("Error establishing WebSocket connection: " + e.getMessage());
            return Map.of(
                    "status", "error",
                    "message", "Failed to establish connection");
        }
    }

    @MessageMapping("/ping")
    @SendToUser("/queue/pong")
    public Map<String, String> handlePing(@Payload Map<String, Object> message, Principal principal) {
        try {
            String userId = principal != null ? principal.getName() : "anonymous";
            return Map.of(
                    "type", "pong",
                    "timestamp", String.valueOf(System.currentTimeMillis()),
                    "userId", userId);
        } catch (Exception e) {
            System.err.println("Error handling ping: " + e.getMessage());
            return Map.of("type", "error", "message", "Ping failed");
        }
    }
}
