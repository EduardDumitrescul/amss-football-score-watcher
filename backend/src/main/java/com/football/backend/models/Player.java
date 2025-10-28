package com.football.backend.models;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

public class Player {

    private UUID id;
    private String firstname;
    private String lastname;
    private String position;
    private Integer shirtNumber;
    private String nationality;
    private Date dateOfBirth;
    private Set<Contract> contracts;
    private Team team;

    // Full constructor for mappers
    public Player(UUID id, String firstname, String lastname, String position, 
                  Integer shirtNumber, String nationality, Date dateOfBirth, 
                  Set<Contract> contracts, Team team) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.position = position;
        this.shirtNumber = shirtNumber;
        this.nationality = nationality;
        this.dateOfBirth = dateOfBirth;
        this.contracts = contracts;
        this.team = team;
    }

    public UUID getId() { return id; }
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public String getPosition() { return position; }
    public Integer getShirtNumber() { return shirtNumber; }
    public String getNationality() { return nationality; }
    public Date getDateOfBirth() { return dateOfBirth; }
    public Set<Contract> getContracts() { return contracts; }
    public Team getTeam() { return team; }
}