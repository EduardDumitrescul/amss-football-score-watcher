package com.football.backend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class PlayerSummaryDto {
    private UUID id;
    private String fullName;
    private String position;
    private Integer shirtNumber;
}
