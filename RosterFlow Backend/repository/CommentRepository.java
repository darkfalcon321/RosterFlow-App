package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
