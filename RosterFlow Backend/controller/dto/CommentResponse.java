package com.group10.rosterflow.controller.dto;


public record CommentResponse(
        Long id,
        String content,
        String authorUsername
) {}

