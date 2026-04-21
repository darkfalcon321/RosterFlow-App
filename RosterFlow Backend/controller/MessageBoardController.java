package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.PostResponse;
import com.group10.rosterflow.model.Post;
import com.group10.rosterflow.model.Comment;
import com.group10.rosterflow.service.MessageBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageBoardController {

    private final MessageBoardService messageBoardService;

    @PostMapping("/post")
    public PostResponse createPost(@RequestParam String title,
                           @RequestParam String content,
                           Authentication auth) {
        return messageBoardService.createPost(auth.getName(),title,content);
    }

    @GetMapping("/posts")
    public List<PostResponse> getPosts() {
        return messageBoardService.getAllPosts();
    }

    @PostMapping("/comment/{postId}")
    public Comment addComment(@PathVariable Long postId,
                              @RequestParam String content,
                              Authentication auth) {
        return messageBoardService.addComment(postId, content, auth);
    }

    @GetMapping("/post/{postId}")
    public PostResponse getPost(@PathVariable Long postId) {
        return messageBoardService.getPost(postId);
    }

    @GetMapping("/comments/{postId}")
    public List<Comment> getComments(@PathVariable Long postId) {
        return messageBoardService.getCommentsByPost(postId);
    }
}

