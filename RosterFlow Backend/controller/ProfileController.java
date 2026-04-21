package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.*;
import com.group10.rosterflow.model.UserProfile;
import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.service.UserProfileService;
import com.group10.rosterflow.service.CompanyProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserProfileService userProfileService;
    private final CompanyProfileService companyProfileService;

    // ---------- USER PROFILE ----------

    @PostMapping("/user")
    public ResponseEntity<UserProfileResponse> upsertMyUserProfile(
            @Valid @RequestBody UserProfileRequest request,
            Authentication auth
    ) {
        UserProfile saved = userProfileService.upsertForCurrentUser(request, auth);
        return ResponseEntity.ok(UserProfileResponse.from(saved));
    }

    @GetMapping("/user/me")
    public ResponseEntity<?> getMyUserProfile(Authentication auth) {
        return userProfileService.findForCurrentUser(auth)
                .map(p -> ResponseEntity.ok(UserProfileResponse.from(p)))
                .orElseGet(() -> ResponseEntity.noContent().build()); // 204
    }


    // ---------- COMPANY PROFILE ----------

    @PostMapping("/company")
    public ResponseEntity<CompanyProfileResponse> upsertMyCompanyProfile(
            @Valid @RequestBody CompanyProfileRequest request,
            Authentication auth
    ) {
        CompanyProfile saved = companyProfileService.upsertForCurrentUser(request, auth);
        return ResponseEntity.ok(CompanyProfileResponse.from(saved));
    }

    @GetMapping("/company/me")
    public ResponseEntity<?> getMyCompanyProfile(Authentication auth) {
        return companyProfileService.findForCurrentUser(auth)
                .map(p -> ResponseEntity.ok(CompanyProfileResponse.from(p)))
                .orElseGet(() -> ResponseEntity.noContent().build()); // 204
    }

}
