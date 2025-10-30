package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;

public class CoachDto {

    private String id;
    private String firstname;
    private String lastname;
    
    // Flattened team info
    private String teamId;
    private String teamName;

    // Default constructor for JSON serialization
    public CoachDto() {}

    /**
     * Full constructor, used when fetching a Coach.
     * This will map the associated team's details, flattened.
     */
    public CoachDto(CoachEntity coach) {
        this.id = coach.getId().toString();
        this.firstname = coach.getFirstname();
        this.lastname = coach.getLastname();
        
        TeamEntity team = coach.getTeam();
        if (team != null) {
            this.teamId = team.getId().toString();
            this.teamName = team.getName();
        } else {
            this.teamId = null;
            this.teamName = null;
        }
    }

    // Getters
    public String getId() { return id; }
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public String getTeamId() { return teamId; }
    public String getTeamName() { return teamName; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setTeamId(String teamId) { this.teamId = teamId; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
}

