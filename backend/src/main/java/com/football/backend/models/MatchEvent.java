package com.football.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class MatchEvent {
    private UUID id;
    private UUID matchId;
    private MatchEventType type;
    private Player primaryPlayer;
    private Player secondaryPlayer;
    private Integer minute;
    private String details;
}
