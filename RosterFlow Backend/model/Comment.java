package com.group10.rosterflow.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String content;

    private LocalDateTime createdAt;

    private String createdBy;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;
}

