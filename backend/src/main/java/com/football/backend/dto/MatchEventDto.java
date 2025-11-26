package com.football.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEventDto {
    private UUID id;
    private String type;
    private Integer minute;
    private String details;

    private UUID primaryPlayerId;
    private String primaryPlayerName;

    private UUID secondaryPlayerId;
    private String secondaryPlayerName;
}
