package com.football.backend.services;

import com.football.backend.dto.CreateEditionDto;
import com.football.backend.entities.CompetitionEntity;
import com.football.backend.entities.EditionEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.mappers.EditionMapper;
import com.football.backend.mappers.MatchMapper;
import com.football.backend.mappers.TeamMapper;
import com.football.backend.models.*;
import com.football.backend.models.strategy.KnockoutStrategy;
import com.football.backend.models.strategy.RobinRoundDoubleStrategy;
import com.football.backend.models.strategy.RobinRoundStrategy;
import com.football.backend.models.strategy.Strategy;
import com.football.backend.repositories.CompetitionRepository;
import com.football.backend.repositories.EditionRepository;
import com.football.backend.repositories.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EditionService {

    private final EditionRepository editionRepository;
    private final CompetitionRepository competitionRepository;
    private final TeamRepository teamRepository;
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
                .orElseThrow(() -> new RuntimeException("Competition not found"));

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
                .map(entity -> {
                    entity.setId(null);

                    entity.setEdition(editionEntity);
                    return entity;
                })
                .forEach(editionEntity::addMatch);

        editionRepository.save(editionEntity);

        if (dto.getStrategyType() != CompetitionStrategy.KNOCKOUT) {
            standingsService.initializeStandings(editionEntity, teams);
        }

        return editionEntity.getId();
    }

    public List<Edition> getEditionsByCompetitionId(UUID competitionId) {
        return editionRepository.findByCompetition_Id(competitionId)
                .stream()
                .map(editionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateEdition(UUID id, CreateEditionDto dto) {
        EditionEntity edition = editionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Edition not found with ID: " + id));

        edition.setName(dto.getName());

        editionRepository.save(edition);
    }

    @Transactional
    public void deleteEdition(UUID id) {
        if (!editionRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Edition not found with ID: " + id);
        }
        editionRepository.deleteById(id);
    }

    private Strategy resolveStrategy(CompetitionStrategy type) {
        return switch (type) {
            case KNOCKOUT -> knockoutStrategy;
            case ROBIN_ROUND -> robinRoundStrategy;
            case ROBIN_ROUND_DOUBLE -> robinRoundDoubleStrategy;
        };
    }
}