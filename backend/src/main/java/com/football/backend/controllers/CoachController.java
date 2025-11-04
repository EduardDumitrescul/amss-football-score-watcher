package com.football.backend.controllers;

import com.football.backend.dto.CoachDto;
import com.football.backend.dto.CoachSummaryDto;
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

    @PostMapping
    public ResponseEntity<CoachDto> createCoach(@RequestBody CreateCoachRequest createCoachRequest) {
        if (createCoachRequest.getFirstname() == null || createCoachRequest.getFirstname().isEmpty() ||
            createCoachRequest.getLastname() == null || createCoachRequest.getLastname().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        CoachDto newCoach = coachService.createCoach(createCoachRequest);
        return new ResponseEntity<>(newCoach, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CoachSummaryDto>> getAllCoaches() {
        List<CoachSummaryDto> coaches = coachService.getAllCoaches(); 
        return new ResponseEntity<>(coaches, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoachDto> getCoachById(@PathVariable String id) {
        try {
            CoachDto coach = coachService.getCoachById(id);
            return new ResponseEntity<>(coach, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<CoachSummaryDto>> getAvailableCoaches() {
        List<CoachSummaryDto> coaches = coachService.getAvailableCoaches();
        return new ResponseEntity<>(coaches, HttpStatus.OK);
    }
}
