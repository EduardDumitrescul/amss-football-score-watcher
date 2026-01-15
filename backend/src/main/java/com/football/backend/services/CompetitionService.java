package com.football.backend.services;

import com.football.backend.dto.CreateCompetitionDto;
import com.football.backend.dto.CreateEditionDto;
import com.football.backend.entities.CompetitionEntity;
import com.football.backend.repositories.CompetitionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CompetitionService {

    private final CompetitionRepository competitionRepository;
    private final EditionService editionService;

    public UUID createCompetition(CreateCompetitionDto dto) {

        CompetitionEntity competition = new CompetitionEntity();
        competition.setName(dto.getCompetitionName());

        competitionRepository.save(competition);

        CreateEditionDto editionDto = new CreateEditionDto();
        editionDto.setCompetitionId(competition.getId());
        editionDto.setName(dto.getEditionName());
        editionDto.setStrategyType(dto.getStrategyType());
        editionDto.setTeamsIds(dto.getTeamIds());

        editionService.createEdition(editionDto);

        return competition.getId();
    }
}

