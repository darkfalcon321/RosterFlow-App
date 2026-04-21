package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.Unavailability;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UnavailabilityRepository extends JpaRepository<Unavailability, Long> {
    Optional<List<Unavailability>> findByUsername(String username);

    Optional<Unavailability> findById(Long id);

    boolean existsByUsername(String username);

    // find shifts that start between the start and end time of the one you are
    // searching

    Boolean existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(String username,
            LocalDateTime startDate,
            LocalDateTime endDate);

    Boolean existsByUsernameAndStartDateBetween(String username, LocalDateTime startDate,
            LocalDateTime endDate);

    Boolean existsByUsernameAndEndDateBetween(String username, LocalDateTime startDate,
            LocalDateTime endDate);

    Boolean existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndIdNot(String username,
            LocalDateTime startDate,
            LocalDateTime endDate, Long id);

    Boolean existsByUsernameAndStartDateBetweenAndIdNot(String username, LocalDateTime startDate,
            LocalDateTime endDate, Long id);

    Boolean existsByUsernameAndEndDateBetweenAndIdNot(String username, LocalDateTime startDate,
            LocalDateTime endDate, Long id);

}
