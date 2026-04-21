package com.group10.rosterflow.service;

import com.group10.rosterflow.controller.dto.UserProfileRequest;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.model.UserProfile;
import com.group10.rosterflow.repository.UserProfileRepository;
import com.group10.rosterflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }

    private User getCurrentUser(Authentication auth) {
        return getUserByUsername(auth.getName());
    }


    @Transactional
    public UserProfile upsertForCurrentUser(UserProfileRequest req, Authentication auth) {
        User user = getCurrentUser(auth);
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseGet(() -> UserProfile.builder().user(user).build());
        apply(profile, req);
        return userProfileRepository.save(profile);
    }


    @Transactional(readOnly = true)
    public Optional<UserProfile> findForCurrentUser(Authentication auth) {
        User user = getCurrentUser(auth);
        return userProfileRepository.findByUser(user);
    }

    private static void apply(UserProfile profile, UserProfileRequest req) {
        if (req.getFirstName() != null)   profile.setFirstName(req.getFirstName());
        if (req.getLastName() != null)    profile.setLastName(req.getLastName());
        if (req.getContactEmail() != null)profile.setContactEmail(req.getContactEmail());
        if (req.getPhone() != null)       profile.setPhone(req.getPhone());
        if (req.getAddress() != null)     profile.setAddress(req.getAddress());
        if (req.getAbout() != null)       profile.setAbout(req.getAbout());
    }
}
