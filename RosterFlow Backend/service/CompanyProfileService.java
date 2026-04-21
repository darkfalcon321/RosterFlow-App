package com.group10.rosterflow.service;

import com.group10.rosterflow.controller.dto.CompanyProfileRequest;
import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.CompanyProfileRepository;
import com.group10.rosterflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }

    private User getCurrentUser(Authentication auth) {
        return getUserByUsername(auth.getName());
    }

    @Transactional
    public CompanyProfile upsertForCurrentUser(CompanyProfileRequest req, Authentication auth) {
        User user = getCurrentUser(auth);
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseGet(() -> CompanyProfile.builder().user(user).build());
        apply(profile, req);
        return companyProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public Optional<CompanyProfile> findForCurrentUser(Authentication auth) {
        User user = getCurrentUser(auth);
        return companyProfileRepository.findByUser(user);
    }


    static void apply(CompanyProfile profile, CompanyProfileRequest req) {
        if (req.getCompanyName() != null) profile.setCompanyName(req.getCompanyName());
        if (req.getContactEmail() != null) profile.setContactEmail(req.getContactEmail());
        if (req.getPhone() != null) profile.setPhone(req.getPhone());
        if (req.getAddress() != null) profile.setAddress(req.getAddress());
        if (req.getWebsite() != null) profile.setWebsite(req.getWebsite());
        if (req.getDescription() != null) profile.setDescription(req.getDescription());
    }
}
