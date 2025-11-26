package com.football.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchDetailsDto {
    private UUID id;
    private TeamDto homeTeam;
    private TeamDto awayTeam;
    private LocalDateTime matchDate;
    private Integer homeGoals;
    private Integer awayGoals;
    private String status;
    private boolean validated;
    private List<MatchEventDto> events;
}
