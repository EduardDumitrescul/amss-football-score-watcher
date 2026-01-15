package com.football.backend.dto;

import com.football.backend.models.CompetitionStrategy;

import java.util.List;
import java.util.UUID;

public class CreateEditionDto {
    String name;
    UUID competitionId;
    CompetitionStrategy strategyType;
    List<UUID> teamsIds;
}
