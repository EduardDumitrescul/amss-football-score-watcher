package com.football.backend.services;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CreateCoachRequest;
import com.football.backend.entities.CoachEntity;
import com.football.backend.repositories.CoachRepository;
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
}
