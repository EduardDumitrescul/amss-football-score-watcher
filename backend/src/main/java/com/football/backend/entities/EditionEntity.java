package com.football.backend.entities;

import com.football.backend.models.CompetitionStrategy;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "edition")
public class EditionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private CompetitionStrategy strategyType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private CompetitionEntity competition;

    @OneToOne(mappedBy = "edition", cascade = CascadeType.ALL)
    private StandingsEntity standings;

    @OneToMany(mappedBy = "edition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchEntity> matches = new ArrayList<>();

    public void addMatch(MatchEntity match) {
        matches.add(match);
        match.setEdition(this);
    }
}