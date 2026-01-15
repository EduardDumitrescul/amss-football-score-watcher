package com.football.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class Team {
    private UUID id;
    private Coach coach;
    private String name;
}
