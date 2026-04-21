package com.group10.rosterflow.service;

import com.group10.rosterflow.controller.dto.PostResponse;
import com.group10.rosterflow.model.Post;
import com.group10.rosterflow.model.Comment;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.PostRepository;
import com.group10.rosterflow.repository.CommentRepository;
import com.group10.rosterflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageBoardService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public PostResponse createPost(String username, String title, String content) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Post post = Post.builder()
                .title(title)
                .content(content)
                .createdBy(author.getUsername())
                .build();

        return PostAndCommentDtoMapper.toPostResponse(postRepository.save(post));
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostAndCommentDtoMapper::toPostResponse)
                .toList();
    }

    public Comment addComment(Long postId, String content, Authentication auth) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .content(content)
                .createdAt(LocalDateTime.now())
                .createdBy(auth.getName())
                .post(post)
                .build();

        return commentRepository.save(comment);
    }

    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        return PostAndCommentDtoMapper.toPostResponse(post);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return post.getComments();
    }
}


