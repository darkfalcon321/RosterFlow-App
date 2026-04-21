package com.group10.rosterflow.service;

import com.group10.rosterflow.controller.dto.CompanyListResponse;
import com.group10.rosterflow.controller.dto.CompanyProfileRequest;
import com.group10.rosterflow.controller.dto.CompanyProfileResponse;
import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.CompanyProfileRepository;
import com.group10.rosterflow.repository.UserRepository;
import com.group10.rosterflow.security.Role;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.group10.rosterflow.service.CompanyProfileService.apply;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyService companyService;

    @Transactional(readOnly = true)
    public List<CompanyListResponse> listCompanyUsers() {
        List<User> users = userRepository.findAllByRole(Role.COMPANY);
        return users.stream().map(CompanyListResponse::from).toList();
    }

    @Transactional
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setEnabled(false);
        user.setDisabledAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void hardDeleteDisabledUsers() {
        LocalDateTime threshold = LocalDateTime.now().minusMonths(3);
        List<User> toDelete = userRepository.findByEnabledFalseAndDisabledAtBefore(threshold);
        userRepository.deleteAll(toDelete);
    }

    @Transactional
    public CompanyProfileResponse updateCompany(Long id, CompanyProfileRequest req) {
        CompanyProfile profile = companyProfileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company not found"));

        apply(profile, req);
        return CompanyProfileResponse.from(companyProfileRepository.save(profile));
    }

    @Transactional
    public void deactivateCompany(Long companyId) {
        User company = userRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found"));

        company.setEnabled(false);
        userRepository.save(company);
    }


}
