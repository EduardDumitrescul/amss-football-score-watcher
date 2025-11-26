package com.football.backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MatchEventCreateRequest {
    private UUID matchId;
    private String type;
    private UUID primaryPlayerId;
    private UUID secondaryPlayerId;
    private Integer minute;
    private String details;
}
