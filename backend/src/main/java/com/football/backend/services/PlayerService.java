package com.football.backend.services;

import com.football.backend.dto.CreateContractRequest;
import com.football.backend.dto.CreatePlayerRequest;
import com.football.backend.dto.PlayerDto;
import com.football.backend.dto.PlayerSummaryDto;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.mappers.PlayerMapper;
import com.football.backend.repositories.PlayerRepository;
import com.football.backend.repositories.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final PlayerMapper playerMapper;
    private final ContractService contractService;

    @Autowired
    public PlayerService(PlayerRepository playerRepository, TeamRepository teamRepository, PlayerMapper playerMapper, ContractService contractService) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
        this.playerMapper = playerMapper;
        this.contractService = contractService;
    }

    /**
     * Creates a new player.
     * @param request DTO with new player data.
     * @return DTO of the created player.
     */
    @Transactional
    public PlayerDto createPlayer(CreatePlayerRequest request) {
        
        TeamEntity team = null;
        if (request.getTeamId() != null) {
            team = teamRepository.findById(UUID.fromString(request.getTeamId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));
        }

        PlayerEntity newPlayer = PlayerEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .position(request.getPosition())
                .shirtNumber(request.getShirtNumber())
                .nationality(request.getNationality())
                .dateOfBirth(request.getDateOfBirth())
                .team(team)
                .build();

        PlayerEntity savedPlayer = playerRepository.saveAndFlush(newPlayer);
        return new PlayerDto(savedPlayer);
    }

    /**
     * Retrieves all players.
     * @return A list of all player DTOs.
     */
    @Transactional(readOnly = true)
    public List<PlayerSummaryDto> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(playerMapper::toSummaryDto)
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

    @Transactional(readOnly = true)
    public List<PlayerSummaryDto> getPlayersByTeamId(String teamId) {
        List<PlayerEntity> players = playerRepository.findAllByTeamId(UUID.fromString(teamId));
        return players.stream()
                .map(playerMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    /**
     * Signs a contract for a player with a team.
     * @param request DTO with contract data.
     * @return DTO of the updated player.
     */
    @Transactional
    public PlayerDto signContract(CreateContractRequest request) {
        PlayerEntity player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + request.getPlayerId()));

        TeamEntity team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));

        contractService.createContract(request);

        player.setTeam(team);
        playerRepository.save(player);

        return new PlayerDto(player);
    }
}
