package com.group10.rosterflow.config;

import com.group10.rosterflow.security.AuthEntryPointJwt;
import com.group10.rosterflow.security.AuthTokenFilter;
import com.group10.rosterflow.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class WebSecurityConfig {
        @Autowired
        CustomUserDetailsService userDetailsService;
        @Autowired
        private AuthEntryPointJwt unauthorizedHandler;

        @Bean
        public AuthTokenFilter authenticationJwtTokenFilter() {
                return new AuthTokenFilter();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration authenticationConfiguration) throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.ignoringRequestMatchers(
                                                "/api/auth/**",
                                                "/api/test/all",
                                                "/h2-console/**",
                                                "/api/profile/**",
                                                "/swagger-ui.html",
                                                "/swagger-ui/**",
                                                "/v3/api-docs/**",
                                                "/swagger-resources/**",
                                                "/webjars/**",
                                                "/api/company/**",
                                                "/api/admin/**",
                                                "/api/user/**",
                                                "/api/message/**"))
                                .headers(headers -> headers
                                                .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                                .cors(cors -> cors.disable())
                                .exceptionHandling(exceptionHandling -> exceptionHandling
                                                .authenticationEntryPoint(unauthorizedHandler))
                                .sessionManagement(sessionManagement -> sessionManagement
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                                                .requestMatchers(
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-resources/**",
                                                                "/webjars/**")
                                                .permitAll()
                                                .requestMatchers("/api/auth/signup",
                                                                "/api/auth/signin",
                                                                "/api/auth/forgot-password",
                                                                "/api/auth/reset-password",
                                                                "/api/auth/reset-password/validate",
                                                                "/api/test/all",
                                                                "/h2-console/**")
                                                .permitAll()
                                                .requestMatchers("/api/auth/company-signup").hasRole("ADMIN")
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/company/**").hasAnyRole("COMPANY", "ADMIN",
                                                                "SUBCOMPANY")
                                                .requestMatchers("/api/user/**").hasAnyRole("USER", "COMPANY", "ADMIN")
                                                .requestMatchers("/api/profile/**")
                                                .hasAnyRole("USER", "COMPANY", "ADMIN", "SUBCOMPANY")
                                                .requestMatchers("/api/message/**")
                                                .hasAnyRole("USER", "COMPANY", "ADMIN")
                                                .anyRequest().authenticated());
                // Add the JWT Token filter before the UsernamePasswordAuthenticationFilter
                http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }
}
