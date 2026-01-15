package com.football.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class Standings {
    private UUID editionId;
    private Edition edition;
    private List<StandingsEntry> entries;
}
