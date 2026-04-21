package com.group10.rosterflow.service;

import com.group10.rosterflow.controller.dto.CommentResponse;
import com.group10.rosterflow.controller.dto.PostResponse;
import com.group10.rosterflow.model.Comment;
import com.group10.rosterflow.model.Post;

import java.util.List;
import java.util.stream.Collectors;

public class PostAndCommentDtoMapper {

    public static PostResponse toPostResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedBy(),
                post.getComments() != null
                        ? post.getComments().stream()
                        .map(PostAndCommentDtoMapper::toCommentResponse)
                        .toList()
                        : List.of()
        );
    }

    public static CommentResponse toCommentResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedBy()
        );
    }
}

