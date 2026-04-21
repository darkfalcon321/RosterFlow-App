package com.group10.rosterflow.controller.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.security.Role;
import lombok.*;

import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyProfileResponse {
    private Long id;

    private String username;
    private Set<Role> roles;

    private String companyName;
    private String contactEmail;
    private String phone;
    private String address;
    private String website;
    private String description;

    public static CompanyProfileResponse from(CompanyProfile profile) {
        return CompanyProfileResponse.builder()
                .id(profile.getId())
                .username(profile.getUser() != null ? profile.getUser().getUsername() : null)
                .roles(profile.getUser() != null ? profile.getUser().getRoles() : null)
                .companyName(profile.getCompanyName())
                .contactEmail(profile.getContactEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .website(profile.getWebsite())
                .description(profile.getDescription())
                .build();
    }
}

