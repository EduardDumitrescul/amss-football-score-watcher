package com.football.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditionDashboardDto {
    UUID editionId;
    UUID competitionId;
    String editionName;
    String competitionName;
    List<StandingsEntryDto> table;
    List<List<MatchListDto>> rounds;
}
