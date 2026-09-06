package com.keiba.tracker.controller;

import com.keiba.tracker.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final String appUsername;
    private final String appPassword;

    public AuthController(
        JwtUtil jwtUtil,
        @Value("${app.username}") String appUsername,
        @Value("${app.password}") String appPassword
    ) {
        this.jwtUtil = jwtUtil;
        this.appUsername = appUsername;
        this.appPassword = appPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (appUsername.equals(username) && appPassword.equals(password)) {
            return ResponseEntity.ok(Map.of("token", jwtUtil.generate(username)));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
