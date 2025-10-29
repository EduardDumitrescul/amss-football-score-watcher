package com.football.backend.controllers;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CreateCoachRequest;
import com.football.backend.services.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coaches")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class CoachController {

    private final CoachService coachService;

    @Autowired
    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    /**
     * Handles POST requests to create a new coach.
     * @param createCoachRequest The request body containing coach details.
     * @return The newly created coach data as a DTO.
     */
    @PostMapping
    public ResponseEntity<CoachDto> createCoach(@RequestBody CreateCoachRequest createCoachRequest) {
        // Basic validation
        if (createCoachRequest.getFirstname() == null || createCoachRequest.getFirstname().isEmpty() ||
            createCoachRequest.getLastname() == null || createCoachRequest.getLastname().isEmpty()) {
            return ResponseEntity.badRequest().build(); // Or return a proper error message
        }
        
        CoachDto newCoach = coachService.createCoach(createCoachRequest);
        return new ResponseEntity<>(newCoach, HttpStatus.CREATED);
    }
}
