package com.football.backend.services;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CoachSummaryDto;
import com.football.backend.dto.CreateCoachRequest;
import com.football.backend.entities.CoachEntity;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.mappers.CoachMapper;
import com.football.backend.repositories.CoachRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CoachService {

    private final CoachRepository coachRepository;
    private final CoachMapper coachMapper;

    @Autowired
    public CoachService(CoachRepository coachRepository, CoachMapper coachMapper) {
        this.coachRepository = coachRepository;
        this.coachMapper = coachMapper;
    }

    @Transactional
    public CoachDto createCoach(CreateCoachRequest request) {
        CoachEntity newCoach = CoachEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .build();
        
        CoachEntity savedCoach = coachRepository.saveAndFlush(newCoach);
        
        return new CoachDto(savedCoach);
    }

    @Transactional(readOnly = true)
    public List<CoachSummaryDto> getAllCoaches() {
        List<CoachEntity> coaches = coachRepository.findAll();
        
        return coaches.stream()
                .map(coachMapper::toSummaryDto) 
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CoachDto getCoachById(String id) {
        CoachEntity coach = coachRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + id));
        
        Hibernate.initialize(coach.getTeam());

        return new CoachDto(coach);
    }

    @Transactional(readOnly = true)
    public List<CoachSummaryDto> getAvailableCoaches() {
        List<CoachEntity> coaches = coachRepository.findByTeamIsNull();
        return coaches.stream()
                .map(coachMapper::toSummaryDto)
                .collect(Collectors.toList());
    }
}
