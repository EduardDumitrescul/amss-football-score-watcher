package com.football.backend.services;

import com.football.backend.entities.ContractEntity;
import com.football.backend.entities.PlayerEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.*;

@Service
public class TeamPowerService {

    private final PlayerService playerService;

    // Constante pentru calcule
    private static final double IDEAL_AGE = 27.0;
    private static final double IDEAL_COHESION_MONTHS = 36.0;
    private static final long MAX_TEAM_VALUATION = 200_000_000;
    private static final long IDEAL_TEAM_SIZE = 25;

    @Autowired
    public TeamPowerService(PlayerService playerService) {
        this.playerService = playerService;
    }

    @Transactional(readOnly = true)
    public int calculateTotalTeamPower(String teamId) {
        List<PlayerEntity> players = playerService.getPlayersEntityByTeamId(teamId);

        if (players.isEmpty()) {
            return 0;
        }

        // 1. Team Evaluation (Financiar) - definit de tine ca suma contractelor
        double financialScore = calculateFinancialEvaluationScore(teamId);

        // 2. Average Age (Experiență)
        double ageScore = calculateAverageAgeScore(teamId);

        // 3. Squad Cohesion (Vechimea contractelor)
        double cohesionScore = calculateCohesionScore(teamId);

        // 4. Tactical Balance (Acoperire pe posturi)
        double tacticalScore = calculateTacticalBalanceScore(teamId);

        // 5. Squad Depth (Număr de jucători)
        double depthScore = calculateSquadDepthScore(teamId);

        double totalScore = (financialScore * 0.30) +
                (tacticalScore * 0.25) +
                (ageScore * 0.15) +
                (cohesionScore * 0.15) +
                (depthScore * 0.15);

        return (int) Math.min(100, totalScore);
    }

    public double calculateFinancialEvaluationScore(String teamId) {

        Integer totalSalary = playerService.getPlayersSalaryPerYearByTeamId(teamId);

        if (totalSalary == null || totalSalary == 0) {
            return 0.0;
        }

        //Normalization
        return Math.min(100.0, ((double) totalSalary / MAX_TEAM_VALUATION) * 100);
    }

    public double calculateAverageAgeScore(String teamId) {

        List<PlayerEntity> players = playerService.getPlayersEntityByTeamId(teamId);
        if (players.isEmpty()) return 0.0;

        double totalAge = 0;
        int count = 0;
        LocalDate now = LocalDate.now();

        for (PlayerEntity player : players) {
            if (player.getDateOfBirth() != null) {
                LocalDate dob = player.getDateOfBirth().toInstant()
                        .atZone(ZoneId.systemDefault()).toLocalDate();
                totalAge += Period.between(dob, now).getYears();
                count++;
            }
        }

        if (count == 0) return 0.0;
        double avgAge = totalAge / count;

        double distance = Math.abs(IDEAL_AGE - avgAge);
        return Math.max(0, 100 - (distance * 5));
    }

    public double calculateCohesionScore(String teamId) {

        List<PlayerEntity> players = playerService.getPlayersEntityByTeamId(teamId);
        if (players.isEmpty()) return 0.0;

        long totalMonths = 0;
        int count = 0;
        Date now = new Date();

        for (PlayerEntity player : players) {

            ContractEntity currentContract = player.getContracts().stream()
                    .max(Comparator.comparing(ContractEntity::getStartDate))
                    .orElse(null);

            if (currentContract != null) {
                long diffInMillis = Math.abs(now.getTime() - currentContract.getStartDate().getTime());
                long months = diffInMillis / (1000L * 60 * 60 * 24 * 30);
                totalMonths += months;
                count++;
            }
        }

        if (count == 0) return 0.0;
        double avgMonths = (double) totalMonths / count;

        return Math.min(100.0, (avgMonths / IDEAL_COHESION_MONTHS) * 100);
    }

    public double calculateTacticalBalanceScore(String teamId) {

        List<PlayerEntity> players = playerService.getPlayersEntityByTeamId(teamId);
        if (players.isEmpty()) return 0.0;

        long gkCount = players.stream()
                .filter(p -> p.getPosition() != null && (p.getPosition().toLowerCase().contains("goalkeeper") || p.getPosition().toLowerCase().contains("portar")))
                .count();

        long defCount = players.stream()
                .filter(p -> p.getPosition() != null && (p.getPosition().toLowerCase().contains("defender") || p.getPosition().toLowerCase().contains("back") || p.getPosition().toLowerCase().contains("fundas")))
                .count();

        long midCount = players.stream()
                .filter(p -> p.getPosition() != null && (p.getPosition().toLowerCase().contains("midfield") || p.getPosition().toLowerCase().contains("mijlocas")))
                .count();

        long fwdCount = players.stream()
                .filter(p -> p.getPosition() != null && (p.getPosition().toLowerCase().contains("forward") || p.getPosition().toLowerCase().contains("striker") || p.getPosition().toLowerCase().contains("atacant")))
                .count();

        double score = 100.0;

        if (gkCount < 1) score -= 60;
        else if (gkCount < 2) score -= 10;

        if (defCount < 3) score -= 30;
        if (midCount < 3) score -= 20;
        if (fwdCount < 1) score -= 20;

        return Math.max(0, score);
    }

    public double calculateSquadDepthScore(String teamId) {

        List<PlayerEntity> players = playerService.getPlayersEntityByTeamId(teamId);
        int size = players.size();

        double distance = Math.abs(IDEAL_AGE - size);
        return Math.max(0, 100 - (distance * 4));
    }
}