package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.User;
import com.group10.rosterflow.security.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<List<User>> findByRoles(Role roles);

    Optional<List<User>> findByRolesAndCompany(Role roles, Long company);

    boolean existsByUsername(String username);

    Optional<User> findByUsernameAndRoles(String Username, Role roles);

    @Query("select u from User u join u.roles r where r = :role")
    List<User> findAllByRole(@Param("role") Role role);

    List<User> findByEnabledFalseAndDisabledAtBefore(LocalDateTime dateTime);

}
