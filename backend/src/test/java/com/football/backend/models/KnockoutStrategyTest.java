package com.football.backend.models;

import com.football.backend.models.strategy.KnockoutStrategy;
import com.football.backend.models.strategy.Strategy;
import com.football.backend.services.MatchStrategyService;
import com.football.backend.services.TeamPowerService;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class KnockoutStrategyTest {

    public static void main(String[] args) {

        List<Team> teams = new ArrayList<>();
        teams.add(new Team(UUID.randomUUID(), null, "Barcelona"));
        teams.add(new Team(UUID.randomUUID(), null, "Real Madrid"));
        teams.add(new Team(UUID.randomUUID(), null, "Liverpool"));
        teams.add(new Team(UUID.randomUUID(), null, "Manchester City"));
        teams.add(new Team(UUID.randomUUID(), null, "Bayern Munchen"));
        teams.add(new Team(UUID.randomUUID(), null, "PSG"));
        teams.add(new Team(UUID.randomUUID(), null, "Juventus"));
        teams.add(new Team(UUID.randomUUID(), null, "Inter Milan"));

        //Mock
        TeamPowerService dummyPowerService = new TeamPowerService(null) {
            @Override
            public int calculateTotalTeamPower(String teamId) {
                return (int) (Math.random() * 100);
            }
            @Override
            public double calculateFinancialEvaluationScore(String teamId) {
                return Math.random() * 100;
            }
            @Override
            public double calculateAverageAgeScore(String teamId) {
                return Math.random() * 100;
            }
            @Override
            public double calculateCohesionScore(String teamId) {
                return Math.random() * 100;
            }
            @Override
            public double calculateTacticalBalanceScore(String teamId) {
                return Math.random() * 100;
            }
            @Override
            public double calculateSquadDepthScore(String teamId) {
                return Math.random() * 100;
            }
        };

        MatchStrategyService realDecider = new MatchStrategyService(dummyPowerService);
        Strategy strategy = new KnockoutStrategy(realDecider);
        List<List<Match>> result = strategy.generateStrategy(teams);

        for (int i = 0; i < result.size(); i++) {
            System.out.println("====== RUNDA " + (i + 1) + " ======");
            for (Match pair : result.get(i)) {
                System.out.println("  Meci: " + pair.getHomeTeam().getName() + " vs " + pair.getAwayTeam().getName());

            }
            System.out.println();
        }
    }
}