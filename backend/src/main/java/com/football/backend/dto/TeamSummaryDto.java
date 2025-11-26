package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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

}
