package com.football.backend.models;

import com.football.backend.models.strategy.RobinRoundDoubleStrategy;
import com.football.backend.models.strategy.Strategy;


import java.util.List;
import java.util.UUID;

public class RobinRoundDoubleStrategyTest {

    public static void main(String[] args) {
        Competition competition = new Competition(UUID.randomUUID(), "Test");
        Edition edition = new Edition(UUID.randomUUID(), "25/26 Season", competition.getId(), CompetitionStrategy.ROBIN_ROUND_DOUBLE, null);

        List<Team> teams = List.of(
                new Team(new UUID(1,3), null, "A"),
                new Team(new UUID(1,3), null, "B"),
                new Team(new UUID(1,3), null,"C"),
                new Team(new UUID(1,3), null,"D")
        );


        Strategy doubleStrategy = new RobinRoundDoubleStrategy();
        List<List<Match>> doubleResult = doubleStrategy.generateStrategy(edition, teams);

        printRounds(doubleResult);
    }

    private static void printRounds(List<List<Match>> rounds) {
        for (int i = 0; i < rounds.size(); i++) {
            System.out.println("Runda " + (i + 1) + ":");
            for (Match match : rounds.get(i)) {
                System.out.println("  " + match.getHomeTeam().getName() + " vs " + match.getAwayTeam().getName());
            }
            System.out.println();
        }
    }
}
