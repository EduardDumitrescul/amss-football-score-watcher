package com.football.backend.dto;

import lombok.Data;
import java.util.Date;

/**
 * DTO (Data Transfer Object) for receiving data from the frontend
 * to create a new player. This separates the API model from the
 * database entity.
 */
@Data
public class CreatePlayerRequest {
    
    private String firstname;
    private String lastname;
    private String position;
    private Integer shirtNumber;
    private String nationality;
    private Date dateOfBirth;
    
    // We only need the ID of the team to link it
    // The frontend will send a UUID string
    // private String teamId; // Uncomment when Team relationship is ready
}

