package com.football.backend.dto;

import com.football.backend.models.CompetitionStrategy;

import java.util.List;
import java.util.UUID;

public class CreateCompetitionDto {
    String competitionName;
    String editionName;
    CompetitionStrategy strategyType;
    List<UUID> teamIds;
}
