package com.football.backend.services;

import com.football.backend.dto.CreateContractRequest;
import com.football.backend.entities.ContractEntity;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.repositories.ContractRepository;
import com.football.backend.repositories.PlayerRepository;
import com.football.backend.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public ContractService(ContractRepository contractRepository, PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.contractRepository = contractRepository;
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    @Transactional
    public ContractEntity createContract(CreateContractRequest request) {
        PlayerEntity player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + request.getPlayerId()));

        TeamEntity team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));

        ContractEntity newContract = ContractEntity.builder()
                .player(player)
                .team(team)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .salaryPerYear(request.getSalaryPerYear())
                .build();

        return contractRepository.save(newContract);
    }

    @Transactional(readOnly = true)
    public List<ContractEntity> getContractsByPlayerId(String playerId) {
        return contractRepository.findAllByPlayerId(UUID.fromString(playerId));
    }
}
