package com.group10.rosterflow.controller.dto;

import com.group10.rosterflow.security.Role;
import com.group10.rosterflow.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {
    @Email(message = "Username must be a valid email")
    @NotBlank(message = "Username (email) is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Set<String> roles;
}
