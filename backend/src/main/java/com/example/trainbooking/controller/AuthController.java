package com.example.trainbooking.controller;

import com.example.trainbooking.dto.LoginRequest;
import com.example.trainbooking.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String DEMO_EMAIL = "admin@rail.com";
    private static final String DEMO_PASSWORD = "password123";

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        boolean validEmail = DEMO_EMAIL.equalsIgnoreCase(request.getEmail());
        boolean validPassword = DEMO_PASSWORD.equals(request.getPassword());

        if (!validEmail || !validPassword) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return new LoginResponse("Rail Admin", DEMO_EMAIL, "ADMIN");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException exception) {
        return Map.of("message", exception.getMessage());
    }
}
