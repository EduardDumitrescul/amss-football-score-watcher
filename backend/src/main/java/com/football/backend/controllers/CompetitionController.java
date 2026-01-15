package com.football.backend.controllers;

import com.football.backend.dto.CreateCompetitionDto;
import com.football.backend.models.Competition;
import com.football.backend.services.CompetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/competitions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CompetitionController {

    private final CompetitionService competitionService;

    @PostMapping
    public ResponseEntity<UUID> createCompetition(@RequestBody CreateCompetitionDto dto) {
        UUID competitionId = competitionService.createCompetition(dto);

        return new ResponseEntity<>(competitionId, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Competition> getCompetition(@PathVariable UUID id) {
        return ResponseEntity.ok(competitionService.getCompetition(id));
    }

    @GetMapping
    public ResponseEntity<List<Competition>> getAllCompetitions() {
        return ResponseEntity.ok(competitionService.getAllCompetitions());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCompetition(@PathVariable UUID id, @RequestBody CreateCompetitionDto dto) {
        competitionService.updateCompetition(id, dto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable UUID id) {
        competitionService.deleteCompetition(id);
        return ResponseEntity.noContent().build();
    }
}