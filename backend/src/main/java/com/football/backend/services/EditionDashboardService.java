package com.football.backend.services;

import com.football.backend.dto.EditionDashboardDto;
import com.football.backend.dto.MatchListDto;
import com.football.backend.dto.StandingsEntryDto;
import com.football.backend.entities.EditionEntity;
import com.football.backend.mappers.MatchMapper;
import com.football.backend.models.CompetitionStrategy;
import com.football.backend.models.Match;
import com.football.backend.repositories.EditionRepository;
import com.football.backend.repositories.MatchRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EditionDashboardService {

    private final EditionRepository editionRepository;
    private final MatchRepository matchRepository;
    private final StandingsService standingsService;

    private final MatchMapper matchMapper;

    public EditionDashboardDto getDashboard(UUID editionId) {

        EditionEntity edition = editionRepository.findById(editionId).orElseThrow();

        List<List<MatchListDto>> rounds = groupByMatchDay(editionId);

        List<StandingsEntryDto> table =
                edition.getStrategyType() == CompetitionStrategy.KNOCKOUT
                        ? List.of()
                        : standingsService.getStandings(editionId);

        return new EditionDashboardDto(
                edition.getId(),
                edition.getCompetition().getId(),
                edition.getName(),
                edition.getCompetition().getName(),
                table,
                rounds
        );
    }

    private List<List<MatchListDto>> groupByMatchDay(UUID editionId) {

        return matchRepository.findByEditionIdOrderByMatchDateAsc(editionId)
                .stream()
                .map(matchMapper::toDomain)
                .collect(Collectors.groupingBy(Match::getMatchDate))
                .values()
                .stream()
                .map(list -> list.stream()
                        .map(matchMapper::toListDto)
                        .toList()
                )
                .toList();
    }
}

