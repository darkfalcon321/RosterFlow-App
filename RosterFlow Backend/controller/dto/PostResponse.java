package com.group10.rosterflow.controller.dto;

import java.util.List;

public record PostResponse(
        Long id,
        String title,
        String content,
        String authorUsername,
        List<CommentResponse> comments
) {}

