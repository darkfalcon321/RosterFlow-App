package com.group10.rosterflow.controller;

import com.group10.rosterflow.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @DeleteMapping("/users/disable/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        companyService.disableUser(id);
        return ResponseEntity.ok("User disabled successfully");
    }
}
