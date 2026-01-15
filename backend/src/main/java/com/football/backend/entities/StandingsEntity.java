package com.football.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "standings")
public class StandingsEntity {
    @Id
    private UUID editionId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "edition_id")
    private EditionEntity edition;

    @OneToMany(mappedBy = "standings", cascade = CascadeType.ALL)
    private List<StandingsEntryEntity> entries;
}
