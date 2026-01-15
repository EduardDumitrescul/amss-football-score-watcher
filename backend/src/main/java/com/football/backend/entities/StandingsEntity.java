package com.football.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
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
