package com.football.backend.dto;

import com.football.backend.entities.TeamEntity;

public class TeamDto {

    private String id;
    private String name;

    // Default constructor for JSON serialization
    public TeamDto() {}

    /**
     * Constructor 1: Full constructor, used when fetching a Team.
     * This will map the associated coach's details, flattened.
     */
    public TeamDto(TeamEntity team) {
        this.id = team.getId().toString();
        this.name = team.getName();
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
}
