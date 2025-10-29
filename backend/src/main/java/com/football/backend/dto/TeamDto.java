package com.football.backend.dto;

import com.football.backend.entities.TeamEntity;
import lombok.Data;

import java.util.UUID;

@Data
public class TeamDto {
    private UUID id;
    private String name;

    public TeamDto(TeamEntity team) {
        this.id = team.getId();
        this.name = team.getName();
    }
}
