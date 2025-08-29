package com.codepanel.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        try {
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
            String sessionId = headerAccessor.getSessionId();
            
            System.out.println("New WebSocket connection established. Session ID: " + sessionId);
            
            // TODO: Store active session information
            // TODO: Update user online status
            
        } catch (Exception e) {
            System.err.println("Error handling WebSocket connection: " + e.getMessage());
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        try {
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
            String sessionId = headerAccessor.getSessionId();
            String userId = (String) headerAccessor.getSessionAttributes().get("userId");
            
            System.out.println("WebSocket connection closed. Session ID: " + sessionId + 
                             ", User ID: " + userId);
            
            // TODO: Remove session from active sessions
            // TODO: Update user offline status
            // TODO: Notify relevant users about user going offline
            
        } catch (Exception e) {
            System.err.println("Error handling WebSocket disconnection: " + e.getMessage());
        }
    }
}


