package com.football.backend.entities;

import com.football.backend.models.MatchEventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "match_event")
public class MatchEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;

    @Enumerated(EnumType.STRING)
    private MatchEventType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_player_id")
    private PlayerEntity primaryPlayer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "secondary_player_id")
    private PlayerEntity secondaryPlayer;

    private Integer minute;
    private String details;
}
