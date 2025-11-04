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

    /**
     * Creates a new coach in the database.
     * @param request The DTO containing the new coach's data.
     * @return A DTO of the newly created coach.
     */
    @Transactional
    public CoachDto createCoach(CreateCoachRequest request) {
        CoachEntity newCoach = CoachEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .build();
        
        CoachEntity savedCoach = coachRepository.saveAndFlush(newCoach); // Use saveAndFlush
        
        return new CoachDto(savedCoach);
    }

    /**
     * Retrieves all coaches from the database.
     * @return A list of DTOs for all coaches.
     */
    @Transactional(readOnly = true) // Add Transactional
    public List<CoachSummaryDto> getAllCoaches() {
        List<CoachEntity> coaches = coachRepository.findAll();
        
        return coaches.stream()
                .map(coachMapper::toSummaryDto) 
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single coach by their ID.
     * @param id The UUID of the coach to find.
     * @return A DTO of the found coach.
     * @throws ResourceNotFoundException if no coach is found with the given ID.
     */
    @Transactional(readOnly = true)
    public CoachDto getCoachById(String id) {
        CoachEntity coach = coachRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + id));
        
        Hibernate.initialize(coach.getTeam());

        return new CoachDto(coach);
    }
}
