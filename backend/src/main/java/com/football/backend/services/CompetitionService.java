package com.football.backend.services;

import com.football.backend.dto.CreateCompetitionDto;
import com.football.backend.dto.CreateEditionDto;
import com.football.backend.entities.CompetitionEntity;
import com.football.backend.models.Competition;
import com.football.backend.repositories.CompetitionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompetitionService {

    private final CompetitionRepository competitionRepository;
    private final EditionService editionService;

    @Transactional
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

    public Competition getCompetition(UUID id) {
        return competitionRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Competition not found with ID: " + id));
    }

    public List<Competition> getAllCompetitions() {
        return competitionRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateCompetition(UUID id, CreateCompetitionDto dto) {
        CompetitionEntity competition = competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competition not found with ID: " + id));

        competition.setName(dto.getCompetitionName());

        competitionRepository.save(competition);
    }

    @Transactional
    public void deleteCompetition(UUID id) {
        if (!competitionRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Competition not found with ID: " + id);
        }
        competitionRepository.deleteById(id);
    }

    private Competition toDto(CompetitionEntity entity) {
        return new Competition(
                entity.getId(),
                entity.getName()
        );
    }
}