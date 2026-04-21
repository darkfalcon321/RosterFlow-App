package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.User;
import com.group10.rosterflow.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);
}

