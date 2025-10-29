package com.football.backend.dto;

import com.football.backend.entities.CoachEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoachDto {
    // This is the data structure we will send back to the frontend
    private UUID id;
    private String firstname;
    private String lastname;
    
    /**
     * Helper constructor to easily convert an Entity to a DTO.
     * @param entity The CoachEntity from the database.
     */
    public CoachDto(CoachEntity entity) {
        this.id = entity.getId();
        this.firstname = entity.getFirstname();
        this.lastname = entity.getLastname();
    }
}
