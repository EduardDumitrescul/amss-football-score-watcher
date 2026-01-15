package com.football.backend.controllers;

import com.football.backend.dto.CreateEditionDto;
import com.football.backend.dto.EditionDashboardDto;
import com.football.backend.models.Edition;
import com.football.backend.services.EditionDashboardService;
import com.football.backend.services.EditionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/editions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EditionController {

    private final EditionService editionService;
    private final EditionDashboardService editionDashboardService;

    @PostMapping
    public ResponseEntity<UUID> createEdition(@RequestBody CreateEditionDto dto) {
        UUID editionId = editionService.createEdition(dto);
        return new ResponseEntity<>(editionId, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<EditionDashboardDto> getDashboard(@PathVariable UUID id) {
        EditionDashboardDto dashboard = editionDashboardService.getDashboard(id);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/by-competition/{competitionId}")
    public ResponseEntity<List<Edition>> getEditionsByCompetition(@PathVariable UUID competitionId) {
        return ResponseEntity.ok(editionService.getEditionsByCompetitionId(competitionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateEdition(@PathVariable UUID id, @RequestBody CreateEditionDto dto) {
        editionService.updateEdition(id, dto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEdition(@PathVariable UUID id) {
        editionService.deleteEdition(id);
        return ResponseEntity.noContent().build();
    }
}