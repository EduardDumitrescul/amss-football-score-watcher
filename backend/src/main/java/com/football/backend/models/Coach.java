package com.football.backend.models;

import lombok.Getter;

import java.util.UUID;

@Getter
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
}
