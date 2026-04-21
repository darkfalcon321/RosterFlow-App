package com.group10.rosterflow.service;

import com.group10.rosterflow.model.PasswordResetToken;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.PasswordResetTokenRepository;
import com.group10.rosterflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                MailService mailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    public void startResetFlowByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            PasswordResetToken token = PasswordResetToken.create(user.orElse(null), 15);
            tokenRepository.save(token);
            String link = frontendBaseUrl + "/reset-password?token=" + token.getToken();
            mailService.sendPasswordReset(username, link, mailFrom);
        }
    }

    @Transactional
    public void resetPassword(String tokenValue, String newRawPassword) {
        PasswordResetToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Token expired/used");
        }

        validatePassword(newRawPassword);

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    private void validatePassword(String p) {
        if (p == null) throw new IllegalArgumentException("Password is required");
        boolean ok = p.length() >= 8
                && p.matches(".*[A-Z].*")
                && p.matches(".*[a-z].*")
                && p.matches(".*\\d.*");
        if (!ok) {
            throw new IllegalArgumentException("Weak password: min 8 chars, include upper, lower, digit");
        }
    }
}
