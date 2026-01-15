package com.football.backend.models;

import com.football.backend.models.strategy.RobinRoundStrategy;
import com.football.backend.models.strategy.Strategy;

import java.util.List;
import java.util.UUID;

public class RobinRoundStrategyTest {

    public static void main(String[] args) {
        Competition competition = new Competition(UUID.randomUUID(), "Test");
        Edition edition = new Edition(UUID.randomUUID(), "25/26 Season", competition, null);

        List<Team> teams = List.of(
                new Team(new UUID(1,3), null, "A"),
                new Team(new UUID(1,3), null, "B"),
                new Team(new UUID(1,3), null,"C"),
                new Team(new UUID(1,3), null,"D")
        );

        Strategy strategy = new RobinRoundStrategy();
        List<List<Match>> result = strategy.generateStrategy(edition, teams);

        for (int i = 0; i < result.size(); i++) {
            System.out.println("Runda " + (i + 1) + ":");
            for (Match match : result.get(i)) {
                System.out.println("  " + match.getHomeTeam().getName() + " vs " + match.getAwayTeam().getName());
            }
            System.out.println();
        }
    }
}
