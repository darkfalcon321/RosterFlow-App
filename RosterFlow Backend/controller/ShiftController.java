package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.AddShiftRequest;
import com.group10.rosterflow.controller.dto.CompanyProfileResponse;
import com.group10.rosterflow.controller.dto.ModifyShiftRequest;
import com.group10.rosterflow.controller.dto.SeeShiftsRequest;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.model.Shift;
import com.group10.rosterflow.repository.CompanyProfileRepository;
import com.group10.rosterflow.repository.ShiftRepository;
import com.group10.rosterflow.repository.UnavailabilityRepository;
import com.group10.rosterflow.repository.UserRepository;
import com.group10.rosterflow.security.Role;
import com.group10.rosterflow.service.CompanyProfileService;
import com.group10.rosterflow.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import com.group10.rosterflow.service.CompanyProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/company/shift")
@RequiredArgsConstructor
public class ShiftController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    CompanyProfileRepository companyRepository;
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

    private final CompanyProfileService companyProfileService;

    @PostMapping("/add")
    public String addShift(@RequestBody AddShiftRequest req, Authentication authentication) {
        LocalDateTime start = req.getStartDate();
        LocalDateTime end = req.getEndDate();
        System.out.println("Here");
        System.out.println();
        System.out.println(authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY")));

        // System.out.println(["ROLE_COMPANY"]);
        System.out.println(authentication.getAuthorities());
        // There is no check that the user is actually present and is a EMPLOYEE
        if (!userRepository.existsByUsername(req.getUsername())) {
            return "Error: trying to add a shift for a user that does not exist!";
        }
        // preventing from adding shifts for user type that are not USER
        if (userRepository.findByUsernameAndRoles(req.getUsername(), Role.USER).orElse(null) == null) {
            return "Error: trying to add a shift for someone that is not an EMPLOYEE!";
        }
        // Create new shift for an user
        // check that a shift start time is actually before end time
        if (start.isBefore(end)) {
            // check shift overlapping
            Boolean startBetween = shiftRepository.existsByUsernameAndStartDateBetween(
                    req.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(startBetween);
            Boolean endBetween = shiftRepository.existsByUsernameAndEndDateBetween(
                    req.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfter = shiftRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            req.getUsername(),
                            req.getStartDate(), req.getEndDate());
            System.out.println(isStartBeforeAndEndAfter);
            // check for unavailability overlapping
            Boolean startBetweenUn = unavailabilityRepository.existsByUsernameAndStartDateBetween(
                    req.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(startBetween);
            Boolean endBetweenUn = unavailabilityRepository.existsByUsernameAndEndDateBetween(
                    req.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfterUn = unavailabilityRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            req.getUsername(),
                            req.getStartDate(), req.getEndDate());
            System.out.println(isStartBeforeAndEndAfter);
            if (startBetween || endBetween || isStartBeforeAndEndAfter) {
                return "There is another shift that overlaps in time for this specific user!!!";
            } else {
                if (startBetweenUn || endBetweenUn || isStartBeforeAndEndAfterUn) {
                    return "There is another unavailability that overlaps in time for this specific user!!!";
                } else {
                    boolean isCompany = authentication.getAuthorities().stream()
                            .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY"));
                    if (isCompany) {
                        User company_user = userRepository.findByUsername(authentication.getName()).orElse(null);
                        CompanyProfile profile = companyRepository
                                .findByUser(company_user).orElse(null);
                        Shift newShift = new Shift(
                                null,
                                req.getUsername(),
                                req.getDate(),
                                req.getStartDate(),
                                req.getEndDate(),
                                authentication.getAuthorities().stream()
                                        .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY")),
                                profile.getId());
                        shiftRepository.save(newShift);
                        return "Shift added successfully!";
                    } else {
                        User company_user = userRepository.findByUsername(authentication.getName()).orElse(null);
                        Shift newShift = new Shift(
                                null,
                                req.getUsername(),
                                req.getDate(),
                                req.getStartDate(),
                                req.getEndDate(),
                                authentication.getAuthorities().stream()
                                        .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY")),
                                company_user.getCompany());
                        shiftRepository.save(newShift);
                        return "Shift added successfully!";
                    }
                }
            }
        } else {
            return "The finish time is before the end!!!";
        }
    }

    @PostMapping("/modify")
    public String modifyShift(@RequestBody ModifyShiftRequest req, Authentication authentication) {
        Shift existingShift = shiftRepository.findById(req.getId()).orElse(null);
        if (existingShift == null)
            return "Cannot find shift!";
        else {
            // existingShift.setUsername(req.getUsername());
            // if the username is unique to the company i do not need to check that the
            // company id is correct
            Boolean startBetween = shiftRepository.existsByUsernameAndStartDateBetweenAndIdNot(
                    existingShift.getUsername(),
                    req.getStartDate(), req.getEndDate(), req.getId());
            System.out.println(startBetween);
            Boolean endBetween = shiftRepository.existsByUsernameAndEndDateBetweenAndIdNot(
                    existingShift
                            .getUsername(),
                    req.getStartDate(), req.getEndDate(), req.getId());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfter = shiftRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndIdNot(
                            existingShift
                                    .getUsername(),
                            req.getStartDate(), req.getEndDate(), req.getId());
            System.out.println(isStartBeforeAndEndAfter);
            // check for unavailability overlapping
            Boolean startBetweenUn = unavailabilityRepository.existsByUsernameAndStartDateBetween(
                    existingShift.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(startBetween);
            Boolean endBetweenUn = unavailabilityRepository.existsByUsernameAndEndDateBetween(
                    existingShift.getUsername(),
                    req.getStartDate(), req.getEndDate());
            System.out.println(endBetween);
            Boolean isStartBeforeAndEndAfterUn = unavailabilityRepository
                    .existsByUsernameAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                            existingShift.getUsername(),
                            req.getStartDate(), req.getEndDate());
            System.out.println(isStartBeforeAndEndAfter);
            if (startBetween || endBetween || isStartBeforeAndEndAfter) {
                return "There is another shift that overlaps in time for this specific user!!!";
            } else {
                if (startBetweenUn || endBetweenUn || isStartBeforeAndEndAfterUn) {
                    return "There is another unavailability that overlaps in time for this specific user!!!";
                } else {
                    existingShift.setStartDate(req.getStartDate());
                    existingShift.setEndDate(req.getEndDate());
                    existingShift.setDate(req.getDate());
                    existingShift.setApproved(authentication.getAuthorities().stream()
                            .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY")));
                    // Update other fields as needed
                    shiftRepository.save(existingShift);
                    return "Shift modified!!";
                }
            }
        }
    }

    @PostMapping("/delete")
    public String deleteShift(@RequestBody Long id, Authentication authentication) {
        Shift existingShift = shiftRepository.findById(id).orElse(null);
        if (existingShift == null)
            return "Cannot find shift!";
        else {
            if (authentication.getAuthorities().stream()
                    .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY"))) {
                shiftRepository.deleteById(id);
                return "Shift with ID " + id + " deleted successfully.";
            } else {
                return "You do not have the rights to delete!";
            }

        }

    }

    @PostMapping("/approve")
    public String approveShift(@RequestBody Long id, Authentication authentication) {
        Shift existingShift = shiftRepository.findById(id).orElse(null);
        if (existingShift == null)
            return "Cannot find shift!";
        else {
            if (authentication.getAuthorities().stream()
                    .anyMatch(ga -> ga.getAuthority().equals("ROLE_COMPANY"))) {
                existingShift.setApproved(true);
                shiftRepository.save(existingShift);
                return "Shift with ID " + id + " approved!";
            } else {
                return "You do not have the rights to approve a shift!";
            }

        }

    }

    @PostMapping("/not_approved")
    public List<Shift> seeNotApprovedShifts(@RequestBody SeeShiftsRequest req, Authentication authentication) {
        List<Shift> empty = new ArrayList<Shift>();
        // TODO: needs to check if id is present
        CompanyProfile company = companyProfileService.findForCurrentUser(authentication).orElse(null);
        if (company != null)
            return shiftRepository.findByDateEqualsAndCompanyAndApproved(req.getDate(), company
                    .getId(), false)
                    .orElse(null);
        return empty;
    }

    @PostMapping("/see")
    public List<Shift> seeShifts(@RequestBody SeeShiftsRequest req, Authentication authentication) {
        // List<Shift> [] empty;
        // TODO: needs to check if id is present
        List<Shift> empty = new ArrayList<Shift>();
        CompanyProfile company = companyProfileService.findForCurrentUser(authentication).orElse(null);
        if (company != null)
            return shiftRepository.findByDateEqualsAndCompany(req.getDate(), company
                    .getId()).orElse(null);
        return empty;
    }

    @PostMapping("/see_subcompany")
    public List<Shift> seeShiftsSubcompany(@RequestBody SeeShiftsRequest req, Authentication authentication) {
        // List<Shift> [] empty;
        // TODO: needs to check if id is present
        List<Shift> empty = new ArrayList<Shift>();
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user != null)
            return shiftRepository.findByDateEqualsAndCompany(req.getDate(), user
                    .getCompany()).orElse(null);
        return empty;
    }
    /*
     * @GetMapping("/all_users")
     * public List<User> seeUsersAll() {
     * // List<Shift> [] empty;
     * // get all the users
     * return userRepository.findAll();
     * }
     */

    @GetMapping("/users_subcompany")
    public List<UserData> seeUsersSubcompany(Authentication authentication) {
        // List<Shift> [] empty;
        // get all the users
        User company_user = userRepository.findByUsername(authentication.getName()).orElse(null);
        // I am getting the id for the company
        List<UserData> result = new ArrayList<UserData>();
        if (company_user != null) {
            Long id = company_user.getCompany();
            List<User> users = userRepository.findByRolesAndCompany(Role.USER, id).orElse(null);
            for (User user : users) {
                // modify the data because private information such as password,etc... should
                // not be visible
                UserData temp = new UserData(user.getId(), user.getUsername());
                result.add(temp);
            }
        }
        return result;
    }

    @GetMapping("/users")
    public List<UserData> seeUsers(Authentication authentication) {
        // List<Shift> [] empty;
        // get all the users
        User company_user = userRepository.findByUsername(authentication.getName()).orElse(null);
        CompanyProfile profile = companyRepository
                .findByUser(company_user).orElse(null);
        // I am getting the id for the company
        List<UserData> result = new ArrayList<UserData>();
        if (profile != null) {
            Long id = profile.getId();
            List<User> users = userRepository.findByRolesAndCompany(Role.USER, id).orElse(null);
            for (User user : users) {
                // modify the data because private information such as password,etc... should
                // not be visible
                UserData temp = new UserData(user.getId(), user.getUsername());
                result.add(temp);
            }
        }
        return result;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public class UserData {
        private Long value;
        private String label;
    }

}
