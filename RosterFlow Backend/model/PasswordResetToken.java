package com.group10.rosterflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
public class PasswordResetToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String token;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    public static PasswordResetToken create(User user, long minutesToLive) {
        PasswordResetToken t = new PasswordResetToken();
        t.token = UUID.randomUUID().toString();
        t.user = user;
        t.expiresAt = Instant.now().plusSeconds(minutesToLive * 60);
        return t;
    }
}
