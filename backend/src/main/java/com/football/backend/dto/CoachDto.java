package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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
}
