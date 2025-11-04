package com.football.backend.controllers;

import com.football.backend.dto.CreateTeamRequest;
import com.football.backend.dto.TeamDto;
import com.football.backend.dto.TeamSummaryDto;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.exceptions.TeamAssignmentException;
import com.football.backend.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173") // Use your React app's port
public class TeamController {

    private final TeamService teamService;

    @Autowired
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamSummaryDto> createTeam(@RequestBody CreateTeamRequest createTeamRequest) {
        if (createTeamRequest.getName() == null || createTeamRequest.getName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        TeamSummaryDto newTeam = teamService.createTeam(createTeamRequest);
        return new ResponseEntity<>(newTeam, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TeamSummaryDto>> getAllTeams() {
        List<TeamSummaryDto> teams = teamService.getAllTeams();
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> getTeamById(@PathVariable String id) {
        try {
            TeamDto team = teamService.getTeamById(id);
            return new ResponseEntity<>(team, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<TeamDto>> getAvailableTeams() {
        List<TeamDto> teams = teamService.getAvailableTeams();
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @PutMapping("/{teamId}/assignCoach/{coachId}")
    public ResponseEntity<?> assignCoachToTeam(@PathVariable String teamId, @PathVariable String coachId) {
        try {
            TeamDto updatedTeam = teamService.assignCoachToTeam(teamId, coachId);
            return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (TeamAssignmentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "An unexpected error occurred: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{teamId}/unassignCoach")
    public ResponseEntity<?> unassignCoach(@PathVariable String teamId) {
        try {
            TeamDto updatedTeam = teamService.unassignCoach(teamId);
            return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "An unexpected error occurred: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // --- Exception Handlers ---

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TeamAssignmentException.class)
    public ResponseEntity<Map<String, String>> handleTeamAssignmentException(TeamAssignmentException e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
    }
}
