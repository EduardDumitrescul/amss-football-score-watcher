package com.football.backend.services;

import com.football.backend.dto.StandingsEntryDto;
import com.football.backend.entities.EditionEntity;
import com.football.backend.entities.StandingsEntity;
import com.football.backend.entities.StandingsEntryEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.repositories.StandingsEntryRepository;
import com.football.backend.repositories.StandingsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StandingsService {

    private final StandingsRepository standingsRepository;
    private final StandingsEntryRepository entryRepository;

    @Transactional
    public void initializeStandings(EditionEntity edition, List<TeamEntity> teams) {

        StandingsEntity standings = new StandingsEntity();
        standings.setEdition(edition);

        standingsRepository.save(standings);

        for (TeamEntity team : teams) {
            StandingsEntryEntity entry = new StandingsEntryEntity();
            entry.setStandings(standings);
            entry.setTeam(team);
            entry.setWins(0);
            entry.setDraws(0);
            entry.setLosses(0);
            entry.setGoalsFor(0);
            entry.setGoalsAgainst(0);

            entryRepository.save(entry);
        }
    }

    @Transactional
    public List<StandingsEntryDto> getStandings(UUID editionId) {
        return entryRepository.findStandingsByEditionId(editionId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private StandingsEntryDto toDto(StandingsEntryEntity e) {
        int played = e.getWins() + e.getDraws() + e.getLosses();

        return new StandingsEntryDto(
                e.getTeam().getId(),
                e.getTeam().getName(),
                e.getWins() * 3 + e.getDraws(),
                played,
                e.getWins(),
                e.getDraws(),
                e.getLosses(),
                e.getGoalsFor(),
                e.getGoalsAgainst(),
                e.getGoalsFor() - e.getGoalsAgainst()
        );
    }
}

