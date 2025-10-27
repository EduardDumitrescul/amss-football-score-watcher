package com.football.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "player")
public class PlayerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String firstname;

    private String lastname;

    private String position;

    private Integer shirtNumber;

    private String nationality;

    private Date dateOfBirth;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ContractEntity> contracts;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private TeamEntity team;

    public void setContracts(Set<ContractEntity> contracts) {
        this.contracts = contracts;
    }

}

    
