package com.codepanel.controllers;

import com.codepanel.models.User;
import com.codepanel.models.dto.LoginRequest;
import com.codepanel.models.dto.LoginResponse;
import com.codepanel.models.dto.RegisterRequest;
import com.codepanel.services.AuthenticationService;
import com.codepanel.services.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public AuthenticationController(AuthenticationService authenticationService, JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = authenticationService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        User user = authenticationService.login(loginRequest);
        String token = jwtService.generateToken(user);
        LoginResponse response = new LoginResponse(token, jwtService.getExpirationTime());
        return ResponseEntity.ok(response);
    }
}
