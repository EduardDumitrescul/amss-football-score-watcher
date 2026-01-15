package com.football.backend.dto;

import com.football.backend.models.CompetitionStrategy;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class CreateCompetitionDto {
    String competitionName;
    String editionName;
    CompetitionStrategy strategyType;
    List<UUID> teamIds;
}
