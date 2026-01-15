package com.football.backend.entities.compositekeys;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingsEntryId implements Serializable {
    private UUID editionId;
    private UUID teamId;
}
