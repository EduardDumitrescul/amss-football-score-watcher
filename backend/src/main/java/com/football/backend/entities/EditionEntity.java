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
@Table(name = "edition")
public class EditionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private CompetitionEntity competition;

    @OneToOne(mappedBy = "edition", cascade = CascadeType.ALL)
    private StandingsEntity standings;

    @OneToMany(mappedBy = "edition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MatchEntity> matches;
}