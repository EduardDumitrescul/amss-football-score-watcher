package com.football.backend.dto;

import com.football.backend.entities.PlayerEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDto {
    private UUID id;
    private String firstname;
    private String lastname;
    private String position;
    private Integer shirtNumber;
    private String nationality;
    private Date dateOfBirth;
    private UUID teamId;

    /**
     * Constructor to map from an Entity to a DTO.
     * @param entity The PlayerEntity to convert.
     */
    public PlayerDto(PlayerEntity entity) {
        this.id = entity.getId();
        this.firstname = entity.getFirstname();
        this.lastname = entity.getLastname();
        this.position = entity.getPosition();
        this.shirtNumber = entity.getShirtNumber();
        this.nationality = entity.getNationality();
        this.dateOfBirth = entity.getDateOfBirth();
        if (entity.getTeam() != null) {
            this.teamId = entity.getTeam().getId();
        }
    }
}

