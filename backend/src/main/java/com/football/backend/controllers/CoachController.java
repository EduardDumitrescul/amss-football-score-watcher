package com.football.backend.controllers;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CreateCoachRequest;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.services.CoachService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coaches")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from your React app
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

    /**
     * Handles GET requests to fetch all coaches.
     * @return A list of all coach DTOs.
     */
    @GetMapping
    public ResponseEntity<List<CoachDto>> getAllCoaches() {
        List<CoachDto> coaches = coachService.getAllCoaches(); 
        return new ResponseEntity<>(coaches, HttpStatus.OK);
    }

    /**
     * GET /api/coaches/{id}
     * Handles GET requests to fetch a single coach by their ID.
     * @param id The UUID of the coach.
     * @return The coach DTO.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CoachDto> getCoachById(@PathVariable String id) {
        try {
            CoachDto coach = coachService.getCoachById(id);
            return new ResponseEntity<>(coach, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
