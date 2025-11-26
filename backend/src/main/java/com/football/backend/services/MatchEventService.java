package com.football.backend.services;

import com.football.backend.entities.MatchEntity;
import com.football.backend.entities.MatchEventEntity;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.mappers.MatchEventMapper;
import com.football.backend.models.MatchEvent;
import com.football.backend.models.MatchEventType;
import com.football.backend.repositories.MatchEventRepository;
import com.football.backend.repositories.MatchRepository;
import com.football.backend.repositories.PlayerRepository;
import com.football.backend.dto.MatchEventCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchEventService {

    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final MatchEventRepository matchEventRepository;
    private final MatchEventMapper matchEventMapper;

    public MatchEvent addEvent(MatchEventCreateRequest request) {
        MatchEntity match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        PlayerEntity primary = null;
        if (request.getPrimaryPlayerId() != null) {
            primary = playerRepository.findById(request.getPrimaryPlayerId())
                    .orElseThrow(() -> new IllegalArgumentException("Primary player not found"));
        }

        PlayerEntity secondary = null;
        if (request.getSecondaryPlayerId() != null) {
            secondary = playerRepository.findById(request.getSecondaryPlayerId())
                    .orElseThrow(() -> new IllegalArgumentException("Secondary player not found"));
        }

        MatchEventEntity entity = MatchEventEntity.builder()
                .match(match)
                .type(MatchEventType.valueOf(request.getType()))
                .primaryPlayer(primary)
                .secondaryPlayer(secondary)
                .minute(request.getMinute())
                .details(request.getDetails())
                .build();

        MatchEventEntity saved = matchEventRepository.save(entity);

        // Update goals if this is a GOAL event
        if (saved.getType() == MatchEventType.GOAL && saved.getPrimaryPlayer() != null) {
            UUID scorerTeamId = saved.getPrimaryPlayer().getTeam().getId();

            if (scorerTeamId.equals(match.getHomeTeam().getId())) {
                match.setHomeGoals((match.getHomeGoals() == null ? 0 : match.getHomeGoals()) + 1);
            } else if (scorerTeamId.equals(match.getAwayTeam().getId())) {
                match.setAwayGoals((match.getAwayGoals() == null ? 0 : match.getAwayGoals()) + 1);
            }

            matchRepository.save(match);
        }

        return matchEventMapper.toDomain(saved);
    }

    @Transactional(readOnly = true)
    public List<MatchEvent> getEventsForMatch(UUID matchId) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        return match.getEvents()
                .stream()
                .map(matchEventMapper::toDomain)
                .toList();
    }
}
