package com.group10.rosterflow.controller.dto;

import com.group10.rosterflow.model.User;
import com.group10.rosterflow.security.Role;
import com.group10.rosterflow.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public class SeeUserShiftRequest {

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}
