package com.football.backend.models.strategy;

import com.football.backend.models.Edition;
import com.football.backend.models.Match;
import com.football.backend.models.Team;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class RobinRoundDoubleStrategy implements Strategy {
    private final Strategy singleStrategy = new RobinRoundStrategy();

    @Override
    public List<List<Match>> generateStrategy(Edition edition, List<Team> teams) {
        List<List<Match>> singleRounds = singleStrategy.generateStrategy(edition, teams);

        List<List<Match>> doubleRounds = new ArrayList<>(singleRounds);

        for (List<Match> round : singleRounds) {
            List<Match> returnRound = new ArrayList<>();
            for (Match match : round) {
                //needs new id, so cannot put same match in return round
                Match m = new Match(UUID.randomUUID(), edition, match.getHomeTeam(), match.getAwayTeam(), null, null, null, null, null);
                returnRound.add(m);
            }
            doubleRounds.add(returnRound);
        }

        return doubleRounds;
    }
}
