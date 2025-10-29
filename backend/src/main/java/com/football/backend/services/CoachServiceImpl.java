package com.football.backend.services;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CreateCoachRequest;
import com.football.backend.entities.CoachEntity;
import com.football.backend.repositories.CoachRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * The concrete implementation of the CoachService.
 * This class handles the business logic for coach operations.
 */
@Service
public class CoachServiceImpl implements CoachService {

    private final CoachRepository coachRepository;

    @Autowired
    public CoachServiceImpl(CoachRepository coachRepository) {
        this.coachRepository = coachRepository;
    }

    /**
     * Creates a new coach in the database.
     * @param request The DTO containing the new coach's data.
     * @return A DTO of the newly created coach.
     */
    @Override
    public CoachDto createCoach(CreateCoachRequest request) {
        // Use the @Builder from your entity for clean object creation
        CoachEntity newCoach = CoachEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .build();
        
        // Save the new entity to the database
        CoachEntity savedCoach = coachRepository.save(newCoach);
        
        // Convert the saved entity back to a DTO to return it
        return new CoachDto(savedCoach);
    }

    /**
     * Retrieves all coaches from the database.
     * @return A list of DTOs for all coaches.
     */
    @Override
    public List<CoachDto> getAllCoaches() {
        // Fetch all entities from the repository
        List<CoachEntity> coaches = coachRepository.findAll();
        
        // Convert the list of entities to a list of DTOs
        // This assumes your CoachDto has a constructor that takes a CoachEntity
        return coaches.stream()
                .map(CoachDto::new) 
                .collect(Collectors.toList());
    }
}
