package com.football.backend.dto;

import java.util.List;
import java.util.UUID;

public class EditionDashboardDto {
    UUID editionId;
    UUID competitionId;
    String editionName;
    String competitionName;
    List<StandingsEntryDto> table;
    List<List<MatchListDto>> rounds;
}
