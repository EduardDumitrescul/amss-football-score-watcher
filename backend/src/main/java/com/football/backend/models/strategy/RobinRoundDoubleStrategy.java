package com.football.backend.models.strategy;

import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;

public class RobinRoundDoubleStrategy implements Strategy {
    private final Strategy singleStrategy = new RobinRoundStrategy();

    @Override
    public List<List<Pair<Team, Team>>> generateStrategy(List<Team> teams) {
        List<List<Pair<Team, Team>>> singleRounds = singleStrategy.generateStrategy(teams);

        List<List<Pair<Team, Team>>> doubleRounds = new ArrayList<>(singleRounds);

        for (List<Pair<Team, Team>> round : singleRounds) {
            List<Pair<Team, Team>> returnRound = new ArrayList<>();
            for (Pair<Team, Team> match : round) {
                returnRound.add(Pair.of(match.getSecond(), match.getFirst()));
            }
            doubleRounds.add(returnRound);
        }

        return doubleRounds;
    }
}
