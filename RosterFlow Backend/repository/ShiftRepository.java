package com.group10.rosterflow.repository;

import com.group10.rosterflow.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
        Optional<List<Shift>> findByDateEqualsAndCompany(LocalDate date, Long company);

        Optional<List<Shift>> findByDateEqualsAndCompanyAndApproved(LocalDate date, Long company, boolean approved);

        Optional<Shift> findById(Long id);

        boolean existsByUsername(String username);

        Optional<List<Shift>> findByDateEqualsAndUsernameEquals(LocalDate date, String username);

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
