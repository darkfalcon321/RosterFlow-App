package com.group10.rosterflow.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CompanyProfileRequest {
    @NotBlank(message = "Company name is required")
    @Size(max = 150)
    private String companyName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Contact email must be a valid email")
    private String contactEmail;

    @Size(max = 40)
    private String phone;

    @Size(max = 255)
    private String address;

    @Size(max = 255)
    private String website;

    @Size(max = 700)
    private String description;
}
