package com.football.backend.services;

import com.football.backend.dto.CreatePlayerRequest;
import com.football.backend.dto.PlayerDto;
import com.football.backend.entities.PlayerEntity;
// import com.football.backend.entities.TeamEntity; // Uncomment when Team is ready
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.repositories.PlayerRepository;
// import com.football.backend.repositories.TeamRepository; // Uncomment when Team is ready
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    // private final TeamRepository teamRepository; // Uncomment when Team is ready

    @Autowired
    public PlayerService(PlayerRepository playerRepository) { // Add TeamRepository to constructor
        this.playerRepository = playerRepository;
        // this.teamRepository = teamRepository;
    }

    /**
     * Creates a new player.
     * @param request DTO with new player data.
     * @return DTO of the created player.
     */
    @Transactional
    public PlayerDto createPlayer(CreatePlayerRequest request) {
        
        // --- Team Logic (Uncomment when Team is ready) ---
        // TeamEntity team = null;
        // if (request.getTeamId() != null) {
        //     team = teamRepository.findById(UUID.fromString(request.getTeamId()))
        //             .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));
        // }

        PlayerEntity newPlayer = PlayerEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .position(request.getPosition())
                .shirtNumber(request.getShirtNumber())
                .nationality(request.getNationality())
                .dateOfBirth(request.getDateOfBirth())
                // .team(team) // Uncomment when Team is ready
                .build();

        PlayerEntity savedPlayer = playerRepository.saveAndFlush(newPlayer);
        return new PlayerDto(savedPlayer);
    }

    /**
     * Retrieves all players.
     * @return A list of all player DTOs.
     */
    @Transactional(readOnly = true)
    public List<PlayerDto> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(PlayerDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single player by their ID.
     * @param id The UUID of the player.
     * @return The player DTO.
     * @throws ResourceNotFoundException if player is not found.
     */
    @Transactional(readOnly = true)
    public PlayerDto getPlayerById(String id) {
        PlayerEntity player = playerRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
        return new PlayerDto(player);
    }
}

