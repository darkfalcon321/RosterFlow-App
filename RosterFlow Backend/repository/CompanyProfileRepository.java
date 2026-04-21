package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
    Optional<CompanyProfile> findByUser(User user);
}
