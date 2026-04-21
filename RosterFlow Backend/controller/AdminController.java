package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.CompanyListResponse;
import com.group10.rosterflow.controller.dto.CompanyProfileRequest;
import com.group10.rosterflow.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/companies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompanyListResponse>> getCompaniesAsUsers() {
        return ResponseEntity.ok(adminService.listCompanyUsers());
    }

    @DeleteMapping("/users/disable/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        adminService.disableUser(id);
        return ResponseEntity.ok("User disabled successfully");
    }


    @PutMapping("/company/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCompany(
            @PathVariable Long id,
            @RequestBody CompanyProfileRequest request) {
        return ResponseEntity.ok(adminService.updateCompany(id, request));
    }

    @DeleteMapping("/company/deactivate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateCompany(@PathVariable Long id) {
        adminService.deactivateCompany(id);
        return ResponseEntity.noContent().build();
    }
}
