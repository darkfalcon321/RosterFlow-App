package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.ForgotPasswordRequest;
import com.group10.rosterflow.controller.dto.ResetPasswordRequest;
import com.group10.rosterflow.repository.PasswordResetTokenRepository;
import com.group10.rosterflow.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService service;
    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetController(PasswordResetService service,
                                   PasswordResetTokenRepository tokenRepository) {
        this.service = service;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody ForgotPasswordRequest req) {
        service.startResetFlowByUsername(req.getUsername());
        return ResponseEntity.ok(Map.of("message", "If the user exists, a reset link has been sent."));
    }

    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validate(@RequestParam String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> !t.isUsed() && t.getExpiresAt().isAfter(Instant.now()))
                .<ResponseEntity<?>>map(t -> ResponseEntity.ok(Map.of("valid", true)))
                .orElseGet(() -> ResponseEntity.badRequest().body(Map.of("valid", false, "error", "Token expired/used")));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody ResetPasswordRequest req) {
        service.resetPassword(req.getToken(), req.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
