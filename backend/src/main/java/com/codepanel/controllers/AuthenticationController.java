package com.codepanel.controllers;

import com.codepanel.models.dto.LoginRequest;
import com.codepanel.models.dto.RegisterRequest;
import com.codepanel.models.dto.TokenResponse;
import com.codepanel.services.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        TokenResponse tokenResponse = authenticationService.registerAndAuthenticate(registerRequest);

        setRefreshTokenCookie(request, response, tokenResponse.getRefreshToken());

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        TokenResponse tokenResponse = authenticationService.authenticate(loginRequest);

        setRefreshTokenCookie(request, response, tokenResponse.getRefreshToken());

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshTokenFromCookie(request);

        if (refreshToken == null) {
            return ResponseEntity.badRequest().build();
        }

        TokenResponse tokenResponse = authenticationService.refreshToken(refreshToken);

        setRefreshTokenCookie(request, response, tokenResponse.getRefreshToken());

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        removeRefreshTokenCookie(response);

        return ResponseEntity.ok().build();
    }

    private void setRefreshTokenCookie(HttpServletRequest request, HttpServletResponse response, String refreshToken) {
        boolean secure = request.isSecure();
        String cookie = String.format(
            "refresh_token=%s; Path=/api; HttpOnly; Max-Age=%d; SameSite=Lax%s",
            refreshToken,
            30 * 24 * 60 * 60,
            secure ? "; Secure" : ""
        );
        response.addHeader("Set-Cookie", cookie);
    }
    
    private void removeRefreshTokenCookie(HttpServletResponse response) {
        String cookie = "refresh_token=; Path=/api; HttpOnly; Max-Age=0; SameSite=Lax";
        response.addHeader("Set-Cookie", cookie);
    }    

    private String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
