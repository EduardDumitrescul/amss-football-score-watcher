package com.football.backend.models;

import com.football.backend.models.strategy.RobinRoundDoubleStrategy;
import com.football.backend.models.strategy.RobinRoundStrategy;
import com.football.backend.models.strategy.Strategy;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.UUID;

public class RobinRoundDoubleStrategyTest {

    public static void main(String[] args) {
        List<Team> teams = List.of(
                new Team(new UUID(1,3), null, "A"),
                new Team(new UUID(1,3), null, "B"),
                new Team(new UUID(1,3), null,"C"),
                new Team(new UUID(1,3), null,"D")
        );


        Strategy doubleStrategy = new RobinRoundDoubleStrategy();
        List<List<Pair<Team, Team>>> doubleResult = doubleStrategy.generateStrategy(teams);

        printRounds(doubleResult);
    }

    private static void printRounds(List<List<Pair<Team, Team>>> rounds) {
        for (int i = 0; i < rounds.size(); i++) {
            System.out.println("Runda " + (i + 1) + ":");
            for (Pair<Team, Team> match : rounds.get(i)) {
                System.out.println("  " + match.getFirst().getName() + " vs " + match.getSecond().getName());
            }
            System.out.println();
        }
    }
}
