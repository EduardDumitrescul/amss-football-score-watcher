package com.football.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class Edition {
    private UUID id;
    private String name;
    private UUID competitionId;
    private CompetitionStrategy StrategyType;
    private Standings standings;
}
