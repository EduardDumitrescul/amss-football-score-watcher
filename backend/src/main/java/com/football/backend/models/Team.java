package com.football.backend.models;

import java.util.UUID;

public class Team {
    private UUID id;
    private Coach coach;
    private String name;

    public Team(UUID id, Coach coach, String name) {
        this.id = id;
        this.coach = coach;
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public Coach getCoach() {
        return coach;
    }

    public String getName() {
        return name;
    }

}
