package com.football.backend.services;

import com.football.backend.dto.CreateCompetitionDto;
import com.football.backend.models.CompetitionStrategy;
import com.football.backend.repositories.CompetitionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

@SpringBootTest
class CompetitionServiceTest {

    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private CompetitionRepository competitionRepository;

    @Test
    void createCompetition_persistsEntity() {
        List<UUID> teamIds = List.of(
                UUID.randomUUID(),
                UUID.randomUUID()
        );

        CreateCompetitionDto dto = new CreateCompetitionDto(
                "Champions League",
                "25/26 Season",
                CompetitionStrategy.ROBIN_ROUND,
                teamIds
        );

        UUID competitionId = competitionService.createCompetition(dto);

        assertTrue(competitionRepository.findById(competitionId).isPresent());
    }
}

