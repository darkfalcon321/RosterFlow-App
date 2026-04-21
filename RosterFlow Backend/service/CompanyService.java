package com.group10.rosterflow.service;

import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final UserRepository userRepository;

    @Transactional
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setEnabled(false);
        user.setDisabledAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
