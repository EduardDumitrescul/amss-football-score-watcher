package com.football.backend.services;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CreateCoachRequest;

/**
 * Service layer interface for Coach operations.
 * The Controller depends on this, and the Implementation implements it.
 */
public interface CoachService {
    CoachDto createCoach(CreateCoachRequest createCoachRequest);
}
