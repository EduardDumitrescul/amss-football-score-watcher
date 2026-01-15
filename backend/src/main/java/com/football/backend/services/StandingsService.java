package com.football.backend.services;

import com.football.backend.dto.StandingsEntryDto;
import com.football.backend.entities.*;
import com.football.backend.models.MatchStatus;
import com.football.backend.repositories.MatchRepository;
import com.football.backend.repositories.StandingsEntryRepository;
import com.football.backend.repositories.StandingsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StandingsService {

    private final StandingsRepository standingsRepository;
    private final StandingsEntryRepository entryRepository;
    private final MatchRepository matchRepository;

    @Transactional
    public void initializeStandings(EditionEntity edition, List<TeamEntity> teams) {
        StandingsEntity standings = new StandingsEntity();
        standings.setEdition(edition);
        standingsRepository.save(standings);

        for (TeamEntity team : teams) {
            createEntry(standings, team);
        }
    }

    @Transactional
    public List<StandingsEntryDto> getStandings(UUID editionId) {
        recalculateStandings(editionId);

        return entryRepository.findStandingsByEditionId(editionId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private void recalculateStandings(UUID editionId) {
        List<StandingsEntryEntity> entries = entryRepository.findStandingsByEditionId(editionId);
        Map<UUID, StandingsEntryEntity> entryMap = entries.stream()
                .collect(Collectors.toMap(e -> e.getTeam().getId(), Function.identity()));

        entries.forEach(this::resetStats);

        List<MatchEntity> finishedMatches = matchRepository.findByEditionIdAndStatus(editionId, MatchStatus.FINISHED);

        for (MatchEntity match : finishedMatches) {
            StandingsEntryEntity home = entryMap.get(match.getHomeTeam().getId());
            StandingsEntryEntity away = entryMap.get(match.getAwayTeam().getId());

            if (home == null || away == null) continue;

            updateStatsFromMatch(home, away, match);
        }

        entryRepository.saveAll(entries);
    }

    private void updateStatsFromMatch(StandingsEntryEntity home, StandingsEntryEntity away, MatchEntity match) {
        int hScore = match.getHomeGoals();
        int aScore = match.getAwayGoals();

        home.setGoalsFor(home.getGoalsFor() + hScore);
        home.setGoalsAgainst(home.getGoalsAgainst() + aScore);

        away.setGoalsFor(away.getGoalsFor() + aScore);
        away.setGoalsAgainst(away.getGoalsAgainst() + hScore);

        if (hScore > aScore) {
            home.setWins(home.getWins() + 1);
            away.setLosses(away.getLosses() + 1);
        } else if (aScore > hScore) {
            away.setWins(away.getWins() + 1);
            home.setLosses(home.getLosses() + 1);
        } else {
            home.setDraws(home.getDraws() + 1);
            away.setDraws(away.getDraws() + 1);
        }
    }

    private void resetStats(StandingsEntryEntity e) {
        e.setWins(0);
        e.setDraws(0);
        e.setLosses(0);
        e.setGoalsFor(0);
        e.setGoalsAgainst(0);
    }

    private void createEntry(StandingsEntity standings, TeamEntity team) {
        StandingsEntryEntity entry = new StandingsEntryEntity();
        entry.setStandings(standings);
        entry.setTeam(team);
        resetStats(entry);
        entryRepository.save(entry);
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