package com.football.backend.services;

import com.football.backend.dto.MatchUpdateRequest;
import com.football.backend.entities.EditionEntity;
import com.football.backend.entities.MatchEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.mappers.MatchMapper;
import com.football.backend.models.Match;
import com.football.backend.models.MatchStatus;
import com.football.backend.repositories.EditionRepository;
import com.football.backend.repositories.MatchRepository;
import com.football.backend.repositories.TeamRepository;
import com.football.backend.dto.MatchCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final EditionRepository editionRepository;
    private final MatchMapper matchMapper;

    public Match createMatch(MatchCreateRequest request) {
        TeamEntity home = teamRepository.findById(request.getHomeTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Home team not found"));
        TeamEntity away = teamRepository.findById(request.getAwayTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Away team not found"));

        EditionEntity edition = editionRepository.findById(request.getEditionId())
                .orElseThrow(() -> new RuntimeException("Edition not found with ID: " + request.getEditionId()));

        MatchEntity entity = MatchEntity.builder()
                .edition(edition)
                .homeTeam(home)
                .awayTeam(away)
                .matchDate(request.getMatchDate())
                .homeGoals(null)
                .awayGoals(null)
                .status(MatchStatus.SCHEDULED)
                .build();

        MatchEntity saved = matchRepository.save(entity);
        return matchMapper.toDomain(saved);
    }

    public Match updateMatch(UUID matchId, MatchUpdateRequest request) {
        MatchEntity entity = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        if (request.getStatus() != null) {
            MatchStatus newStatus = MatchStatus.valueOf(request.getStatus());
            entity.setStatus(newStatus);
        }

        if (request.getMatchDate() != null) {
            entity.setMatchDate(request.getMatchDate());
        }

        MatchEntity saved = matchRepository.save(entity);
        return matchMapper.toDomain(saved);
    }

    @Transactional(readOnly = true)
    public Match getMatch(UUID id) {
        MatchEntity entity = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found: " + id)); // replace with your own exception
        return matchMapper.toDomain(entity);
    }

    @Transactional(readOnly = true)
    public List<Match> getSchedule() {
        return matchRepository.findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime.now())
                .stream()
                .map(matchMapper::toDomain)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Match> getFinishedMatches() {
        return matchRepository.findByStatusOrderByMatchDateDesc(MatchStatus.FINISHED)
                .stream()
                .map(matchMapper::toDomain)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Match> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(matchMapper::toDomain)
                .toList();
    }

    public void deleteMatch(UUID id) {
        if (!matchRepository.existsById(id)) {
            throw new IllegalArgumentException("Match not found: " + id);
        }
        matchRepository.deleteById(id);
    }
}
