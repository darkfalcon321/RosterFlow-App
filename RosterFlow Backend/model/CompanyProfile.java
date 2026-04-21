package com.group10.rosterflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "company_profile",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_company_profile_user", columnNames = "user_id")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(length = 150)
    private String companyName;

    @Column(length = 255)
    private String contactEmail;

    @Column(length = 40)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 255)
    private String website;

    @Column(length = 700)
    private String description;
}
