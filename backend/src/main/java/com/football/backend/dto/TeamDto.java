package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;

public class TeamDto {

    private String id;
    private String name;

    // Flattened coach info
    private String coachId;
    private String coachFirstname;
    private String coachLastname;

    // Default constructor for JSON serialization
    public TeamDto() {}

    /**
     * Constructor 1: Full constructor, used when fetching a Team.
     * This will map the associated coach's details, flattened.
     */
    public TeamDto(TeamEntity team) {
        this.id = team.getId().toString();
        this.name = team.getName();
        
        CoachEntity coach = team.getCoach();
        if (coach != null) {
            this.coachId = coach.getId().toString();
            this.coachFirstname = coach.getFirstname();
            this.coachLastname = coach.getLastname();
        } else {
            this.coachId = null;
            this.coachFirstname = null;
            this.coachLastname = null;
        }
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getCoachId() { return coachId; }
    public String getCoachFirstname() { return coachFirstname; }
    public String getCoachLastname() { return coachLastname; }


    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCoachId(String coachId) { this.coachId = coachId; }
    public void setCoachFirstname(String coachFirstname) { this.coachFirstname = coachFirstname; }
    public void setCoachLastname(String coachLastname) { this.coachLastname = coachLastname; }
}

