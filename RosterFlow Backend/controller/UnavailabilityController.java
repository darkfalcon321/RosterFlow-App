package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.AddShiftRequest;
import com.group10.rosterflow.controller.dto.AddUnavailabilityRequest;
import com.group10.rosterflow.controller.dto.ModifyShiftRequest;
import com.group10.rosterflow.controller.dto.ModifyUnavailabilityRequest;
import com.group10.rosterflow.controller.dto.SignupRequest;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.model.Shift;
import com.group10.rosterflow.model.Unavailability;
import com.group10.rosterflow.repository.ShiftRepository;
import com.group10.rosterflow.repository.UnavailabilityRepository;
import com.group10.rosterflow.repository.UserRepository;
import com.group10.rosterflow.security.Role;
import com.group10.rosterflow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/user/unavailability")
public class UnavailabilityController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ShiftRepository shiftRepository;
    @Autowired
    UnavailabilityRepository unavailabilityRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil jwtUtils;

    @PostMapping("/add")
    public String addUnavailability(@RequestBody AddUnavailabilityRequest req, Authentication authentication) {
        LocalDateTime start = req.getStartDate();
        LocalDateTime end = req.getEndDate();
        // There is no check that the user is actually present and is a EMPLOYEE
        if (!userRepository.existsByUsername(authentication.getName())) {
            return "Error: trying to add a shift for a user that does not exist!";
        }
        // preventing from adding shifts for user type that are not USER
        if (userRepository.findByUsernameAndRoles(authentication.getName(), Role.USER).orElse(null) == null) {
            return "Error: trying to add a shift for someone that is not an EMPLOYEE!";
        }
        // Create new shift for an user
        // check that a shift start time is actually before end time
        if (start.isBefore(end)) {
            Boolean startBetween = shiftRepository.existsByUsernameAndStartDateBetween(
                    authentication
                            .getName(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(startBetween);
            Boolean endBetween = shiftRepository.existsByUsernameAndEndDateBetween(
                    authentication
                            .getName(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfter = shiftRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            authentication
                                    .getName(),
                            req.getStartDate(), req.getEndDate());
            System.out.println(isStartBeforeAndEndAfter);
            // check for unavailability overlapping
            Boolean startBetweenUn = unavailabilityRepository.existsByUsernameAndStartDateBetween(
                    authentication.getName(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(startBetween);
            Boolean endBetweenUn = unavailabilityRepository.existsByUsernameAndEndDateBetween(
                    authentication.getName(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfterUn = unavailabilityRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            authentication.getName(),
                            req.getStartDate(), req.getEndDate());
            System.out.println(isStartBeforeAndEndAfter);
            if (startBetween || endBetween || isStartBeforeAndEndAfter) {
                return "There is another shift that overlaps in time for this specific user!!!";
            } else {
                if (startBetweenUn || endBetweenUn || isStartBeforeAndEndAfterUn) {
                    return "There is another unavailability that overlaps in time for this specific user!!!";
                } else {
                    Unavailability newUnavailability = new Unavailability(
                            null,
                            authentication.getName(),
                            req.getStartDate(),
                            req.getEndDate());
                    unavailabilityRepository.save(newUnavailability);
                    return "Unavailability added successfully!";
                }
            }
        } else {
            return "The finish time is before the end!!!";
        }
    }

    // TODO: the unavailability can be modified if it does not overlap another
    // unavailability or a shift that is already in place!!!
    @PostMapping("/modify")
    public String modifyUnavailability(@RequestBody ModifyUnavailabilityRequest req, Authentication authentication) {
        Unavailability existingUnavailability = unavailabilityRepository.findById(req.getId()).orElse(null);
        if (existingUnavailability == null)
            return "Cannot find unavailability!";
        else {
            // checking for unavailability overlaps
            Boolean startBetween = unavailabilityRepository.existsByUsernameAndStartDateBetweenAndIdNot(
                    existingUnavailability.getUsername(),
                    req.getStartDate(), req.getEndDate(), req.getId());
            System.out.println(startBetween);
            Boolean endBetween = unavailabilityRepository.existsByUsernameAndEndDateBetweenAndIdNot(
                    existingUnavailability
                            .getUsername(),
                    req.getStartDate(), req.getEndDate(), req.getId());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfter = unavailabilityRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndIdNot(
                            existingUnavailability
                                    .getUsername(),
                            req.getStartDate(), req.getEndDate(), req.getId());
            System.out.println(isStartBeforeAndEndAfter);
            // checking for shift overlap
            Boolean startBetweenShift = shiftRepository.existsByUsernameAndStartDateBetween(
                    existingUnavailability.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(startBetweenShift);
            Boolean endBetweenShift = shiftRepository.existsByUsernameAndEndDateBetween(
                    existingUnavailability.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(endBetweenShift);
            Boolean isStartBeforeAndEndAfterShift = shiftRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            existingUnavailability.getUsername(),
                            req.getStartDate(), req.getEndDate());
            System.out.println(isStartBeforeAndEndAfterShift);
            if (startBetween || endBetween || isStartBeforeAndEndAfter) {
                return "There is another unavailability that overlaps in time for this specific user!!!";
            } else {
                if (startBetweenShift || endBetweenShift || isStartBeforeAndEndAfterShift) {
                    return "There is another shift that overlaps in time for this specific user!!!";
                } else {
                    existingUnavailability.setStartDate(req.getStartDate());
                    existingUnavailability.setEndDate(req.getEndDate());
                    // Update other fields as needed
                    unavailabilityRepository.save(existingUnavailability);
                    return "Unavailability modified!!";
                }
            }
        }
    }

    // done
    @PostMapping("/delete")
    public String deleteUnavailability(@RequestBody Long id) {
        Unavailability existingUnavailability = unavailabilityRepository.findById(id).orElse(null);
        if (existingUnavailability == null)
            return "Cannot find unavailability!";
        else {
            unavailabilityRepository.deleteById(id);
            return "Unavailability with ID " + id + " deleted successfully.";
        }

    }

    @GetMapping("/see")
    public List<Unavailability> seeUnavailability(Authentication authentication) {
        // List<Unavailability> [] empty;
        System.out.println(authentication.getName());
        return unavailabilityRepository.findByUsername(authentication.getName()).orElse(null);
    }
}
