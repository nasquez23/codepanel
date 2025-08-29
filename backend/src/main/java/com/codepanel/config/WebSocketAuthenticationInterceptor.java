package com.codepanel.config;

import com.codepanel.models.User;
import com.codepanel.services.JwtService;
import com.codepanel.repositories.UserRepository;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthenticationInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public WebSocketAuthenticationInterceptor(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            System.out.println("Processing CONNECT command");

            List<String> authHeaders = accessor.getNativeHeader("Authorization");
            System.out.println("Authorization headers: " + authHeaders);

            String token = null;

            if (authHeaders != null && !authHeaders.isEmpty()) {
                String authHeader = authHeaders.get(0);
                System.out.println("First auth header: " + authHeader);
                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                    System.out.println("Extracted token: "
                            + (token != null ? token.substring(0, Math.min(20, token.length())) + "..." : "null"));
                }
            }

            if (token != null) {
                try {
                    String userEmail = jwtService.extractUsername(token);
                    if (userEmail != null && !jwtService.isTokenExpired(token)) {
                        User user = userRepository.findByEmail(userEmail).orElse(null);
                        if (user != null) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    user, null, user.getAuthorities());

                            SecurityContextHolder.getContext().setAuthentication(authentication);

                            accessor.setUser(authentication);

                            System.out.println("WebSocket authenticated for user: " + user.getEmail());
                        } else {
                            System.out.println("User not found in database for email: " + userEmail);
                        }
                    } else {
                        System.out
                                .println("JWT token validation failed - expired: " + jwtService.isTokenExpired(token));
                    }
                } catch (Exception e) {
                    System.err.println("WebSocket authentication failed: " + e.getMessage());
                }
            } else {
                System.out.println("No JWT token found in headers");
            }
        } else {
            System.out.println("Not a CONNECT command or accessor is null");
        }

        return message;
    }
}
