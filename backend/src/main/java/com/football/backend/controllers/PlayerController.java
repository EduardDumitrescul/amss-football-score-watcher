package com.football.backend.controllers;

import com.football.backend.dto.CreateContractRequest;
import com.football.backend.dto.CreatePlayerRequest;
import com.football.backend.dto.PlayerDto;
import com.football.backend.dto.PlayerSummaryDto;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from your React app's port
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    /**
     * POST /api/players : Creates a new player.
     */
    @PostMapping
    public ResponseEntity<PlayerDto> createPlayer(@RequestBody CreatePlayerRequest createPlayerRequest) {
        // Basic validation
        if (createPlayerRequest.getFirstname() == null || createPlayerRequest.getFirstname().isEmpty() ||
            createPlayerRequest.getLastname() == null || createPlayerRequest.getLastname().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            PlayerDto newPlayer = playerService.createPlayer(createPlayerRequest);
            return new ResponseEntity<>(newPlayer, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            // This happens if the TeamId is invalid
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }
    }

    /**
     * GET /api/players : Retrieves all players.
     */
    @GetMapping
    public ResponseEntity<List<PlayerSummaryDto>> getAllPlayers() {
        List<PlayerSummaryDto> players = playerService.getAllPlayers();
        return new ResponseEntity<>(players, HttpStatus.OK);
    }

    /**
     * GET /api/players/{id} : Retrieves a single player by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlayerDto> getPlayerById(@PathVariable String id) {
        try {
            PlayerDto player = playerService.getPlayerById(id);
            return new ResponseEntity<>(player, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * POST /api/players/sign-contract : Signs a contract for a player with a team.
     */
    @PostMapping("/sign-contract")
    public ResponseEntity<PlayerDto> signContract(@RequestBody CreateContractRequest createContractRequest) {
        try {
            PlayerDto updatedPlayer = playerService.signContract(createContractRequest);
            return new ResponseEntity<>(updatedPlayer, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
