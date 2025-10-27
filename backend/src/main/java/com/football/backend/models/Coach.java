package com.football.backend.models;

import java.util.UUID;

public class Coach {
    private UUID id;
    private Team team;
    private String firstname;
    private String lastname;

    public Coach(
        UUID id, 
        Team team, 
        String firstname, 
        String lastname
    ) {
        this.id = id;
        this.team = team;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public UUID getId() {
        return id;
    }

    public Team getTeam() {
        return team;
    }


    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }
}
