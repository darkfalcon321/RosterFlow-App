package com.group10.rosterflow.bootstrap;

import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.UserRepository;
import com.group10.rosterflow.security.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrap {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.enabled:true}")
    private boolean enabled;

    @Value("${app.admin.username:admin@rf.local}")
    private String adminUsername;

    @Value("${app.admin.password:Admin@1234}")
    private String adminPassword;

    @Bean
    CommandLineRunner createAdminOnStartup() {
        return args -> {
            if (!enabled) {
                log.info("Admin seeding is disabled (app.admin.enabled=false).");
                return;
            }

            var exists = userRepository.findByUsername(adminUsername).isPresent();
            if (exists) {
                log.info("Admin user '{}' already exists. Skipping seeding.", adminUsername);
                return;
            }

            var admin = User.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .roles(Set.of(Role.ADMIN))
                    .enabled(enabled)
                    .build();

            userRepository.save(admin);
            log.info("Seeded ADMIN user '{}'. You can now login and get an admin token.", adminUsername);
        };
    }
}
