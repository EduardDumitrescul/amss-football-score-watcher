package com.football.backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.football.backend.entities.*;
import com.football.backend.models.CompetitionStrategy;
import com.football.backend.models.MatchEventType;
import com.football.backend.models.MatchStatus;
import com.football.backend.repositories.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final MatchRepository matchRepository;
    private final MatchEventRepository matchEventRepository;
    private final CompetitionRepository competitionRepository;
    private final EditionRepository editionRepository;

    @Autowired
    public DatabaseSeeder(
            TeamRepository teamRepository,
            CoachRepository coachRepository,
            PlayerRepository playerRepository,
            ContractRepository contractRepository,
            MatchRepository matchRepository,
            MatchEventRepository matchEventRepository,
            CompetitionRepository competitionRepository,
            EditionRepository editionRepository
    ) {
        this.teamRepository = teamRepository;
        this.coachRepository = coachRepository;
        this.playerRepository = playerRepository;
        this.contractRepository = contractRepository;
        this.matchRepository = matchRepository;
        this.matchEventRepository = matchEventRepository;
        this.competitionRepository = competitionRepository;
        this.editionRepository = editionRepository;
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

            InputStream competitionsInputStream = new ClassPathResource("seed/competitions.json").getInputStream();
            List<CompetitionSeedDto> competitionDtos = mapper.readValue(competitionsInputStream, new TypeReference<>() {});

            List<CompetitionEntity> competitionEntities = competitionDtos.stream()
                    .map(dto -> CompetitionEntity.builder()
                            .name(dto.getName())
                            .build())
                    .collect(Collectors.toList());
            competitionRepository.saveAll(competitionEntities);

            Map<String, CompetitionEntity> competitionsByName = competitionEntities.stream()
                    .collect(Collectors.toMap(CompetitionEntity::getName, Function.identity()));

            // 4. Seed Editions [NEW]
            InputStream editionsInputStream = new ClassPathResource("seed/editions.json").getInputStream();
            List<EditionSeedDto> editionDtos = mapper.readValue(editionsInputStream, new TypeReference<>() {});

            List<EditionEntity> editionEntities = new ArrayList<>();
            for (EditionSeedDto dto : editionDtos) {
                CompetitionEntity competition = competitionsByName.get(dto.getCompetitionName());
                if (competition == null) {
                    throw new IllegalStateException("Competition not found: " + dto.getCompetitionName());
                }

                EditionEntity edition = EditionEntity.builder()
                        .name(dto.getName())
                        .competition(competition)
                        .strategyType(CompetitionStrategy.valueOf(dto.getStrategyType())) // Maps string to Enum
                        .build();
                editionEntities.add(edition);
            }
            editionRepository.saveAll(editionEntities);

            Map<String, EditionEntity> editionsByName = editionEntities.stream()
                    .collect(Collectors.toMap(EditionEntity::getName, Function.identity()));


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

            Map<String, PlayerEntity> playersByKey = playerRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(
                            p -> playerKey(p.getFirstname(), p.getLastname(), p.getTeam().getName()),
                            Function.identity()
                    ));

            InputStream matchesInputStream = new ClassPathResource("seed/matches.json").getInputStream();
            List<MatchSeedDto> matchDtos = mapper.readValue(matchesInputStream, new TypeReference<>() {});

            List<MatchEntity> matchEntities = new ArrayList<>();
            for (MatchSeedDto dto : matchDtos) {
                TeamEntity homeTeam = teamsByName.get(dto.getHomeTeamName());
                TeamEntity awayTeam = teamsByName.get(dto.getAwayTeamName());

                EditionEntity edition = editionsByName.get(dto.getEditionName());

                if (homeTeam == null || awayTeam == null) {
                    throw new IllegalStateException("Team not found for match seed: " + dto);
                }
                if (edition == null) {
                    throw new IllegalStateException("Edition not found for match seed: " + dto.getEditionName());
                }

                LocalDateTime matchDate = LocalDateTime.parse(dto.getMatchDate());
                MatchStatus status = MatchStatus.valueOf(dto.getStatus());

                MatchEntity match = MatchEntity.builder()
                        .edition(edition)
                        .homeTeam(homeTeam)
                        .awayTeam(awayTeam)
                        .matchDate(matchDate)
                        .homeGoals(dto.getHomeGoals())
                        .awayGoals(dto.getAwayGoals())
                        .status(status)
                        .events(new ArrayList<>())
                        .build();

                matchEntities.add(match);
            }
            matchRepository.saveAll(matchEntities);

            Map<String, MatchEntity> matchesByKey = matchEntities.stream()
                    .collect(Collectors.toMap(
                            m -> matchKey(
                                    m.getHomeTeam().getName(),
                                    m.getAwayTeam().getName(),
                                    m.getMatchDate()
                            ),
                            Function.identity()
                    ));

            InputStream eventsInputStream = new ClassPathResource("seed/match_events.json").getInputStream();
            List<MatchEventSeedDto> eventDtos = mapper.readValue(eventsInputStream, new TypeReference<>() {});

            List<MatchEventEntity> eventEntities = new ArrayList<>();

            for (MatchEventSeedDto dto : eventDtos) {
                LocalDateTime matchDate = LocalDateTime.parse(dto.getMatchDate());
                MatchEntity match = matchesByKey.get(
                        matchKey(dto.getHomeTeamName(), dto.getAwayTeamName(), matchDate)
                );
                if (match == null) {
                    throw new IllegalStateException("Match not found for event seed: " + dto);
                }

                PlayerEntity primaryPlayer = null;
                if (dto.getPrimaryPlayer() != null) {
                    primaryPlayer = playersByKey.get(
                            playerKey(
                                    dto.getPrimaryPlayer().getFirstname(),
                                    dto.getPrimaryPlayer().getLastname(),
                                    dto.getPrimaryPlayer().getTeamName()
                            )
                    );
                }

                PlayerEntity secondaryPlayer = null;
                if (dto.getSecondaryPlayer() != null) {
                    secondaryPlayer = playersByKey.get(
                            playerKey(
                                    dto.getSecondaryPlayer().getFirstname(),
                                    dto.getSecondaryPlayer().getLastname(),
                                    dto.getSecondaryPlayer().getTeamName()
                            )
                    );
                }

                MatchEventType type = MatchEventType.valueOf(dto.getType());

                MatchEventEntity event = MatchEventEntity.builder()
                        .match(match)
                        .type(type)
                        .primaryPlayer(primaryPlayer)
                        .secondaryPlayer(secondaryPlayer)
                        .minute(dto.getMinute())
                        .details(dto.getDetails())
                        .build();

                eventEntities.add(event);
                match.getEvents().add(event);
            }

            matchEventRepository.saveAll(eventEntities);
            matchRepository.saveAll(matchEntities);

        } catch (Exception e) {
            throw new RuntimeException("Failed to seed database", e);
        }
    }

    private static String playerKey(String firstname, String lastname, String teamName) {
        return firstname + "|" + lastname + "|" + teamName;
    }

    private static String matchKey(String homeTeam, String awayTeam, LocalDateTime matchDate) {
        return homeTeam + "|" + awayTeam + "|" + matchDate.toString();
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

    @Data
    private static class CompetitionSeedDto {
        private String name;
    }

    @Data
    private static class EditionSeedDto {
        private String name;
        private String competitionName;
        private String strategyType;
    }

    @Data
    private static class MatchSeedDto {
        private String editionName;
        private String homeTeamName;
        private String awayTeamName;
        private String matchDate;
        private Integer homeGoals;
        private Integer awayGoals;
        private String status;
    }

    @Data
    private static class MatchEventSeedDto {
        private String homeTeamName;
        private String awayTeamName;
        private String matchDate;
        private Integer minute;
        private String type;
        private String details;
        private PlayerRef primaryPlayer;
        private PlayerRef secondaryPlayer;
    }

    @Data
    private static class PlayerRef {
        private String firstname;
        private String lastname;
        private String teamName;
    }
}
