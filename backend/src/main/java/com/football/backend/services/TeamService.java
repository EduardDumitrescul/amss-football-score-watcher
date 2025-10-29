package com.football.backend.services;

import com.football.backend.dto.CreateTeamRequest;
import com.football.backend.dto.TeamDto;
import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.repositories.CoachRepository;
import com.football.backend.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    @Autowired
    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Transactional
    public TeamDto createTeam(CreateTeamRequest request) {
        // Build the new team
        TeamEntity newTeam = TeamEntity.builder()
                .name(request.getName())
                .coach(null)
                .build();

        // Save and return DTO
        TeamEntity savedTeam = teamRepository.saveAndFlush(newTeam);
        return new TeamDto(savedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(TeamDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(String id) {
        TeamEntity team = teamRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
        return new TeamDto(team);
    }
}
