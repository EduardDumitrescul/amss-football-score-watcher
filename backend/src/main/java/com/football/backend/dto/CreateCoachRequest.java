package com.football.backend.dto;

import lombok.Data;

// Using @Data for simplicity, it provides getters, setters, toString, etc.
@Data
public class CreateCoachRequest {
    // These fields must match the JSON sent from the frontend
    private String firstname;
    private String lastname;
}
