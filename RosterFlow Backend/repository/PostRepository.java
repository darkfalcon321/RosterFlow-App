package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}

