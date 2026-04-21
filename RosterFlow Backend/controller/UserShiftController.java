
package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.AddShiftRequest;
import com.group10.rosterflow.controller.dto.ModifyShiftRequest;
import com.group10.rosterflow.controller.dto.SeeShiftsRequest;
import com.group10.rosterflow.controller.dto.SeeUserShiftRequest;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.model.Shift;
import com.group10.rosterflow.repository.ShiftRepository;
import com.group10.rosterflow.repository.UnavailabilityRepository;
import com.group10.rosterflow.repository.UserRepository;
import com.group10.rosterflow.security.Role;
import com.group10.rosterflow.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user/shift")
public class UserShiftController {
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

    @PostMapping("/see")
    public List<Shift> seeShifts(@RequestBody SeeUserShiftRequest req, Authentication authentication) {
        // List<Shift> [] empty;
        return shiftRepository.findByDateEqualsAndUsernameEquals(req.getDate(), authentication.getName()).orElse(null);
    }
}