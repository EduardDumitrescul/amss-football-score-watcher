package com.football.backend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class CoachSummaryDto {
    private UUID id;
    private String fullName;
}
