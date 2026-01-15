package com.football.backend.dto;

import java.util.UUID;

public class StandingsEntryDto {
    UUID teamId;
    String teamName;
    Integer poIntegers;          // 3*W + D
    Integer played;          // W + D + L
    Integer wins;
    Integer draws;
    Integer losses;
    Integer goalsFor;
    Integer goalsAgainst;
    Integer goalDifference;   // GF - GA
}
