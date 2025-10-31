package com.football.backend.services;

import com.football.backend.dto.CreateTeamRequest;
import com.football.backend.dto.TeamDto;
import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.exceptions.ResourceNotFoundException;
import com.football.backend.exceptions.TeamAssignmentException;
import com.football.backend.repositories.CoachRepository;
import com.football.backend.repositories.TeamRepository;
import org.hibernate.Hibernate;
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
    public TeamDto createTeam(CreateTeamRequest request) {
        TeamEntity team = new TeamEntity();
        team.setName(request.getName());
        
        // Coach is no longer set at creation
        team.setCoach(null); 

        TeamEntity savedTeam = teamRepository.saveAndFlush(team);
        return new TeamDto(savedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getAllTeams() {
        List<TeamEntity> teams = teamRepository.findAll();
        // Eagerly fetch coach data within the transaction
        teams.forEach(team -> {
            if (team.getCoach() != null) {
                Hibernate.initialize(team.getCoach());
            }
        });
        return teams.stream()
                .map(TeamDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(String id) {
        TeamEntity team = teamRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
        // Eagerly fetch coach data
        if (team.getCoach() != null) {
            Hibernate.initialize(team.getCoach());
        }
        return new TeamDto(team);
    }

    @Transactional
    public TeamDto assignCoachToTeam(String teamId, String coachId) {
        // 1. Find the team
        TeamEntity newTeam = teamRepository.findById(UUID.fromString(teamId))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        // 2. Find the coach
        CoachEntity coach = coachRepository.findById(UUID.fromString(coachId))
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));

        // 3. Check if the team already has a coach
        if (newTeam.getCoach() != null) {
            throw new TeamAssignmentException("Team " + newTeam.getName() + " already has a coach: " + newTeam.getCoach().getFirstname());
        }

        // 4. Check if this coach is already assigned to another team
        Optional<TeamEntity> oldTeamOpt = teamRepository.findByCoach(coach);
        if (oldTeamOpt.isPresent()) {
            TeamEntity oldTeam = oldTeamOpt.get();
            // Add a check to prevent self-assignment issues
            if (!oldTeam.getId().equals(newTeam.getId())) {
                oldTeam.setCoach(null);
                teamRepository.saveAndFlush(oldTeam); // Use saveAndFlush for immediate effect
            }
        }

        // 5. Assign the coach to the new team
        newTeam.setCoach(coach);
        TeamEntity updatedTeam = teamRepository.saveAndFlush(newTeam); // Use saveAndFlush

        return new TeamDto(updatedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getAvailableTeams() {
        return teamRepository.findByCoachIsNull().stream()
                .map(TeamDto::new)
                .collect(Collectors.toList());
    }

    // --- NEW METHOD ---
    /**
     * Un-assigns a coach from a specific team.
     * @param teamId The ID of the team.
     * @return The updated TeamDto for the team.
     * @throws ResourceNotFoundException if the team is not found.
     */
    @Transactional
    public TeamDto unassignCoach(String teamId) {
        // 1. Find the team
        TeamEntity team = teamRepository.findById(UUID.fromString(teamId))
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        // 2. Check if the team actually has a coach
        if (team.getCoach() == null) {
            // No action needed, but we can just return the team as-is.
            return new TeamDto(team);
        }

        // 3. Set coach to null and save
        team.setCoach(null);
        TeamEntity updatedTeam = teamRepository.saveAndFlush(team);

        return new TeamDto(updatedTeam);
    }
}

