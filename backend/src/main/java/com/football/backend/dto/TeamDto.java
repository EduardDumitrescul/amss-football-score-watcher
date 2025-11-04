package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;

public class TeamDto {

    private String id;
    private String name;
    private String coachId;

    public TeamDto() {}

    public TeamDto(TeamEntity team) {
        this.id = team.getId().toString();
        this.name = team.getName();
        
        CoachEntity coach = team.getCoach();
        if (coach != null) {
            this.coachId = coach.getId().toString();
        } else {
            this.coachId = null;
        }
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getCoachId() { return coachId; }

    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCoachId(String coachId) { this.coachId = coachId; }
}
