package com.football.backend.entities.compositekeys;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class StandingsEntryId implements Serializable {

    private UUID editionId;
    private UUID teamId;

    public StandingsEntryId() {
    }

    public StandingsEntryId(UUID editionId, UUID teamId) {
        this.editionId = editionId;
        this.teamId = teamId;
    }

    public UUID getEditionId() {
        return editionId;
    }

    public void setEditionId(UUID editionId) {
        this.editionId = editionId;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public void setTeamId(UUID teamId) {
        this.teamId = teamId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StandingsEntryId that = (StandingsEntryId) o;
        return Objects.equals(editionId, that.editionId) &&
                Objects.equals(teamId, that.teamId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(editionId, teamId);
    }
}