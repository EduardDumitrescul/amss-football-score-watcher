package com.football.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class Match {
    private UUID id;
    private Team homeTeam;
    private Team awayTeam;
    private LocalDateTime matchDate;
    private Integer homeGoals;
    private Integer awayGoals;
    private MatchStatus status;
    private List<MatchEvent> events;
}
