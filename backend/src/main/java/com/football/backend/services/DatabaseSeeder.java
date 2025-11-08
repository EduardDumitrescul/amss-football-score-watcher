package com.football.backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.ContractEntity;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.repositories.CoachRepository;
import com.football.backend.repositories.ContractRepository;
import com.football.backend.repositories.PlayerRepository;
import com.football.backend.repositories.TeamRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DatabaseSeeder {

    private final TeamRepository teamRepository;
    private final CoachRepository coachRepository;
    private final PlayerRepository playerRepository;
    private final ContractRepository contractRepository;

    @Autowired
    public DatabaseSeeder(TeamRepository teamRepository, CoachRepository coachRepository, PlayerRepository playerRepository, ContractRepository contractRepository) {
        this.teamRepository = teamRepository;
        this.coachRepository = coachRepository;
        this.playerRepository = playerRepository;
        this.contractRepository = contractRepository;
    }

    @Transactional
    public void seedDatabase() {
        try {
            ObjectMapper mapper = new ObjectMapper();

            // Seed Teams
            InputStream teamsInputStream = new ClassPathResource("seed/teams.json").getInputStream();
            List<TeamSeedDto> teamDtos = mapper.readValue(teamsInputStream, new TypeReference<>() {});
            List<TeamEntity> teamEntities = teamDtos.stream()
                    .map(dto -> TeamEntity.builder().name(dto.getName()).build())
                    .collect(Collectors.toList());
            teamRepository.saveAll(teamEntities);
            Map<String, TeamEntity> teamsByName = teamEntities.stream()
                    .collect(Collectors.toMap(TeamEntity::getName, Function.identity()));

            // Seed Coaches
            InputStream coachesInputStream = new ClassPathResource("seed/coaches.json").getInputStream();
            List<CoachSeedDto> coachDtos = mapper.readValue(coachesInputStream, new TypeReference<>() {});
            List<CoachEntity> coachEntities = coachDtos.stream()
                    .map(dto -> {
                        TeamEntity team = teamsByName.get(dto.getTeamName());
                        return CoachEntity.builder()
                                .firstname(dto.getFirstname())
                                .lastname(dto.getLastname())
                                .team(team)
                                .build();
                    })
                    .collect(Collectors.toList());
            coachRepository.saveAll(coachEntities);

            // Update teams with coaches
            coachEntities.forEach(coach -> {
                if (coach.getTeam() != null) {
                    coach.getTeam().setCoach(coach);
                    teamRepository.save(coach.getTeam());
                }
            });


            // Seed Players and Contracts
            InputStream playersInputStream = new ClassPathResource("seed/players.json").getInputStream();
            List<PlayerSeedDto> playerDtos = mapper.readValue(playersInputStream, new TypeReference<>() {});
            playerDtos.forEach(dto -> {
                TeamEntity team = teamsByName.get(dto.getTeamName());
                PlayerEntity player = PlayerEntity.builder()
                        .firstname(dto.getFirstname())
                        .lastname(dto.getLastname())
                        .position(dto.getPosition())
                        .shirtNumber(dto.getShirtNumber())
                        .nationality(dto.getNationality())
                        .dateOfBirth(dto.getDateOfBirth())
                        .team(team)
                        .build();
                playerRepository.save(player);

                if (dto.getContract() != null) {
                    ContractEntity contract = ContractEntity.builder()
                            .player(player)
                            .team(team)
                            .startDate(dto.getContract().getStartDate())
                            .endDate(dto.getContract().getEndDate())
                            .salaryPerYear(dto.getContract().getSalaryPerYear())
                            .build();
                    contractRepository.save(contract);
                }
            });

        } catch (Exception e) {
            throw new RuntimeException("Failed to seed database", e);
        }
    }

    @Data
    private static class TeamSeedDto {
        private String name;
        private String league;
    }

    @Data
    private static class CoachSeedDto {
        private String firstname;
        private String lastname;
        private String teamName;
    }

    @Data
    private static class PlayerSeedDto {
        private String firstname;
        private String lastname;
        private String position;
        private int shirtNumber;
        private String nationality;
        private Date dateOfBirth;
        private String teamName;
        private ContractSeedDto contract;
    }

    @Data
    private static class ContractSeedDto {
        private Date startDate;
        private Date endDate;
        private int salaryPerYear;
    }
}
