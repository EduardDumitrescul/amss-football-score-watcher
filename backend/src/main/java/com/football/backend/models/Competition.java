package com.football.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class Competition {
    private UUID id;
    private String name;
}