package com.football.backend.models;

import com.football.backend.models.strategy.RobinRoundStrategy;
import com.football.backend.models.strategy.Strategy;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.UUID;

public class RobinRoundStrategyTest {

    public static void main(String[] args) {
        List<Team> teams = List.of(
                new Team(new UUID(1,3), null, "A"),
                new Team(new UUID(1,3), null, "B"),
                new Team(new UUID(1,3), null,"C"),
                new Team(new UUID(1,3), null,"D")
        );

        Strategy strategy = new RobinRoundStrategy();
        List<List<Pair<Team, Team>>> result = strategy.generateStrategy(teams);

        for (int i = 0; i < result.size(); i++) {
            System.out.println("Runda " + (i + 1) + ":");
            for (Pair<Team, Team> match : result.get(i)) {
                System.out.println("  " + match.getFirst().getName() + " vs " + match.getSecond().getName());
            }
            System.out.println();
        }
    }
}
