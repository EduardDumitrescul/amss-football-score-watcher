package com.football.backend.services;

import com.football.backend.dto.CreateTeamRequest;
import com.football.backend.dto.TeamDto;
import com.football.backend.dto.TeamSummaryDto;
import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.exceptions.TeamAssignmentException;
import com.football.backend.repositories.CoachRepository;
import com.football.backend.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final CoachRepository coachRepository;

    @Autowired
    public TeamService(TeamRepository teamRepository, CoachRepository coachRepository) {
        this.teamRepository = teamRepository;
        this.coachRepository = coachRepository;
    }

    @Transactional
    public TeamSummaryDto createTeam(CreateTeamRequest request) {
        TeamEntity team = new TeamEntity();
        team.setName(request.getName());
        
        team.setCoach(null); 

        TeamEntity savedTeam = teamRepository.saveAndFlush(team);
        return new TeamSummaryDto(savedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamSummaryDto> getAllTeams() {
        List<TeamEntity> teams = teamRepository.findAll();
        return teams.stream()
                .map(TeamSummaryDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(String id) {
        TeamEntity team = teamRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
        return new TeamDto(team);
    }

    @Transactional
    public TeamDto assignCoachToTeam(String teamId, String coachId) {
        TeamEntity newTeam = teamRepository.findById(UUID.fromString(teamId))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        CoachEntity coach = coachRepository.findById(UUID.fromString(coachId))
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));

        if (newTeam.getCoach() != null) {
            throw new TeamAssignmentException("Team " + newTeam.getName() + " already has a coach: " + newTeam.getCoach().getFirstname());
        }

        Optional<TeamEntity> oldTeamOpt = teamRepository.findByCoach(coach);
        if (oldTeamOpt.isPresent()) {
            TeamEntity oldTeam = oldTeamOpt.get();
            if (!oldTeam.getId().equals(newTeam.getId())) {
                oldTeam.setCoach(null);
                teamRepository.saveAndFlush(oldTeam);
            }
        }

        newTeam.setCoach(coach);
        TeamEntity updatedTeam = teamRepository.saveAndFlush(newTeam);

        return new TeamDto(updatedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getAvailableTeams() {
        return teamRepository.findByCoachIsNull().stream()
                .map(TeamDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeamDto unassignCoach(String teamId) {
        TeamEntity team = teamRepository.findById(UUID.fromString(teamId))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        if (team.getCoach() == null) {
            return new TeamDto(team);
        }

        team.setCoach(null);
        TeamEntity updatedTeam = teamRepository.saveAndFlush(team);

        return new TeamDto(updatedTeam);
    }
}
