package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class TeamDto {

    private UUID id;
    private String name;
    private String coachId;

    public TeamDto() {}

    public TeamDto(TeamEntity team) {
        this.id = team.getId();
        this.name = team.getName();
        
        CoachEntity coach = team.getCoach();
        if (coach != null) {
            this.coachId = coach.getId().toString();
        } else {
            this.coachId = null;
        }
    }
}
