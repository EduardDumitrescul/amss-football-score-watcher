package com.football.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchListDto {
    private UUID id;
    private String homeTeamName;
    private String awayTeamName;
    private LocalDateTime matchDate;
    private Integer homeGoals;
    private Integer awayGoals;
    private String status;
}
