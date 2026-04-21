package com.group10.rosterflow.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotBlank(message = "Token is required")
    private String token;
    @NotBlank(message = "New Password is required")
    private String newPassword;
}
