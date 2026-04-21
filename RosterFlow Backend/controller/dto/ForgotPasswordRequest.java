package com.group10.rosterflow.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {
    @Email(message = "Username must be a valid email")
    @NotBlank(message = "Username (email) is required")
    private String username; // email
}
