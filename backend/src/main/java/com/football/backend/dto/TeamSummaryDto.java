package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;

public class TeamSummaryDto {

    private String id;
    private String name;
    private String coachName;

    public TeamSummaryDto() {}

    public TeamSummaryDto(TeamEntity team) {
        this.id = team.getId().toString();
        this.name = team.getName();
        
        CoachEntity coach = team.getCoach();
        if (coach != null) {
            this.coachName = coach.getFirstname() + " " + coach.getLastname();
        } else {
            this.coachName = null;
        }
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getCoachName() { return coachName; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCoachName(String coachName) { this.coachName = coachName; }
}
