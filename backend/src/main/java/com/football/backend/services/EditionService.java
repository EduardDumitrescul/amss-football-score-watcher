package com.football.backend.services;

import com.football.backend.dto.CreateEditionDto;
import com.football.backend.entities.CompetitionEntity;
import com.football.backend.entities.EditionEntity;
import com.football.backend.entities.MatchEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.mappers.EditionMapper;
import com.football.backend.mappers.MatchMapper;
import com.football.backend.mappers.TeamMapper;
import com.football.backend.models.CompetitionStrategy;
import com.football.backend.models.Match;
import com.football.backend.models.strategy.KnockoutStrategy;
import com.football.backend.models.strategy.RobinRoundDoubleStrategy;
import com.football.backend.models.strategy.RobinRoundStrategy;
import com.football.backend.models.strategy.Strategy;
import com.football.backend.repositories.CompetitionRepository;
import com.football.backend.repositories.EditionRepository;
import com.football.backend.repositories.MatchRepository;
import com.football.backend.repositories.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class EditionService {

    private final EditionRepository editionRepository;
    private final CompetitionRepository competitionRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final StandingsService standingsService;

    private final KnockoutStrategy knockoutStrategy;
    private final RobinRoundStrategy robinRoundStrategy;
    private final RobinRoundDoubleStrategy robinRoundDoubleStrategy;

    private final EditionMapper editionMapper;
    private final TeamMapper teamMapper;
    private final MatchMapper matchMapper;

    @Transactional
    public UUID createEdition(CreateEditionDto dto) {

        CompetitionEntity competition = competitionRepository
                .findById(dto.getCompetitionId())
                .orElseThrow();

        EditionEntity editionEntity = new EditionEntity();
        editionEntity.setName(dto.getName());
        editionEntity.setCompetition(competition);
        editionEntity.setStrategyType(dto.getStrategyType());

        editionRepository.save(editionEntity);

        List<TeamEntity> teams = teamRepository.findAllById(dto.getTeamsIds());

        Strategy strategy = resolveStrategy(dto.getStrategyType());

        List<List<Match>> generatedRounds = strategy.generateStrategy(
                editionMapper.toDomain(editionEntity),
                teams.stream()
                        .map(teamMapper::toDomain)
                        .collect(Collectors.toList())
        );

        generatedRounds.stream()
                .flatMap(List::stream)
                .map(matchMapper::toEntity)
                .forEach(editionEntity::addMatch);

        editionRepository.save(editionEntity);

        standingsService.initializeStandings(editionEntity, teams);

        return editionEntity.getId();
    }


    private Strategy resolveStrategy(CompetitionStrategy type) {
        return switch (type) {
            case KNOCKOUT -> knockoutStrategy;
            case ROBIN_ROUND -> robinRoundStrategy;
            case ROBIN_ROUND_DOUBLE -> robinRoundDoubleStrategy;
        };
    }
}
