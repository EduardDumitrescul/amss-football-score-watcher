package com.football.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MatchCreateRequest {
    private UUID editionId;
    private UUID homeTeamId;
    private UUID awayTeamId;
    private LocalDateTime matchDate;
}
