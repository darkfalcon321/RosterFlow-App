package com.group10.rosterflow.controller;

import com.group10.rosterflow.controller.dto.LoginRequest;
import com.group10.rosterflow.controller.dto.SignupRequest;
import com.group10.rosterflow.model.CompanyProfile;
import com.group10.rosterflow.model.User;
import com.group10.rosterflow.repository.CompanyProfileRepository;
import com.group10.rosterflow.repository.UserRepository;
import com.group10.rosterflow.security.Role;
import com.group10.rosterflow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CompanyProfileRepository companyRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil jwtUtils;

    @PostMapping("/signin")
    public String authenticateUser(@RequestBody LoginRequest user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtils.generateToken(userDetails);
    }

    @PostMapping("/signup")
    public String registerUser(@jakarta.validation.Valid @RequestBody SignupRequest req,
            Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        CompanyProfile profile = companyRepository
                .findByUser(user).orElse(null);
        System.out.println("Profile");
        System.out.println(profile);
        if (profile != null) {
            if (userRepository.existsByUsername(req.getUsername())) {
                return "Error: Username is already taken!";
                // TODO: if the username already exists we can add the company id to the list of
                // company ids

                // Create new user's account
                /*
                 * System.out.println("Profile");
                 * System.out.println(profile);
                 * if (profile != null) {
                 * System.out.println(profile.getId());
                 * }
                 * user = userRepository.findByUsername(req.getUsername()).orElse(null);
                 * Set<Long> ids = user.getCompany();
                 * if (!ids.contains(profile.getId())) {
                 * ids.add(profile.getId());
                 * user.setCompany(ids);
                 * userRepository.save(user);
                 * return "Updated user companies id!";
                 * } else {
                 * return "Company id already present!";
                 * }
                 */

            }
            // CompanyProfile profile = companyRepository
            // .findByUser(userRepository.findByUsername(authentication.getName()).orElse(null)).orElse(null);
            // Create new user's account with just one id
            System.out.println("Profile");
            System.out.println(profile);
            if (profile != null) {
                System.out.println(profile.getId());
            }
            User newUser = new User(
                    null,
                    req.getUsername(),
                    encoder.encode(req.getPassword()),
                    true,
                    null,
                    Set.of(Role.USER),
                    profile.getId());
            userRepository.save(newUser);
            return "User registered successfully!";
        }
        return "Cannot register an user until you create a company profile!!!";
    }

    @PostMapping("/signup-subcompany")
    public String registerSubcompany(@jakarta.validation.Valid @RequestBody SignupRequest req,
            Authentication authentication) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return "Error: Username is already taken!";
        }
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        CompanyProfile profile = companyRepository
                .findByUser(user).orElse(null);
        if (profile != null) {
            // Create new user's account
            User newUser = new User(
                    null,
                    req.getUsername(),
                    encoder.encode(req.getPassword()),
                    true,
                    null,
                    Set.of(Role.SUBCOMPANY),
                    profile.getId());
            userRepository.save(newUser);
            return "User registered successfully!";
        }
        return "Cannot register an user until you create a company profile!!!";
    }

    @PostMapping("/company-signup")
    public String registerCompany(@jakarta.validation.Valid @RequestBody SignupRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return "Error: Username is already taken!";
        }

        // Create new user's account
        User newUser = new User(
                null,
                req.getUsername(),
                encoder.encode(req.getPassword()),
                true,
                null,
                Set.of(Role.COMPANY),
                null);
        userRepository.save(newUser);
        return "Company registered successfully!";
    }
}
