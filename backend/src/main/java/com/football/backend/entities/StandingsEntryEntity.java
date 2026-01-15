package com.football.backend.entities;

import com.football.backend.entities.compositekeys.StandingsEntryId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "standings_entry")
public class StandingsEntryEntity {
    @EmbeddedId
    private StandingsEntryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("editionId")
    @JoinColumn(name = "edition_id")
    private StandingsEntity standings;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("teamId")
    @JoinColumn(name = "team_id")
    private TeamEntity team;

    private Integer wins;
    private Integer draws;
    private Integer losses;

    @Column(name = "goals_for")
    private Integer goalsFor;

    @Column(name = "goals_against")
    private Integer goalsAgainst;
}
