package com.group10.rosterflow.controller.dto;

import com.group10.rosterflow.model.User;

public record CompanyListResponse(
        Long id,
        String name
) {
    public static CompanyListResponse from(User u) {
        return new CompanyListResponse(
                u.getId(),
                u.getUsername()
        );
    }
}
