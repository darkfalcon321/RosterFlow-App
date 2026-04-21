package com.group10.rosterflow.controller.dto;

import com.group10.rosterflow.model.UserProfile;
import com.group10.rosterflow.security.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse {
    private Long id;

    private String username;
    private Set<Role> roles;

    private String firstName;
    private String lastName;
    private String contactEmail;
    private String phone;
    private String address;
    private String about;


    public static UserProfileResponse from(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .username(profile.getUser() != null ? profile.getUser().getUsername() : null)
                .roles(profile.getUser() != null ? profile.getUser().getRoles() : null)
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .contactEmail(profile.getContactEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .about(profile.getAbout())
                .build();
    }
}

