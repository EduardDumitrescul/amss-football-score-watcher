package com.football.backend.services;

import java.util.List;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CreateCoachRequest;

/**
 * Service layer interface for Coach operations.
 * The Controller depends on this, and the Implementation implements it.
 */
public interface CoachService {
    CoachDto createCoach(CreateCoachRequest createCoachRequest);

    /**
     * Retrieves all coaches.
     * @return A list of all coach DTOs.
     */
    List<CoachDto> getAllCoaches();
}
