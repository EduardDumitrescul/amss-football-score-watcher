package com.football.backend.models.strategy;

import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class KnockoutStrategy implements Strategy{

    @Override
    public List<List<Pair<Team, Team>>> generateStrategy(List<Team> teams) {
        List<List<Pair<Team, Team>>> rounds = new ArrayList<>();

        List<Team> currentTeams = new ArrayList<>(teams);
        Collections.shuffle(currentTeams);

        Random random = new Random();

        while (currentTeams.size() > 1) {
            List<Pair<Team, Team>> matchesInThisRound = new ArrayList<>();
            List<Team> winners = new ArrayList<>();

            for (int i = 0; i < currentTeams.size(); i += 2) {

                if (i + 1 < currentTeams.size()) {
                    Team team1 = currentTeams.get(i);
                    Team team2 = currentTeams.get(i + 1);

                    boolean decider = random.nextBoolean();
                    Team winner = decider ? team1 : team2;
                    Team loser = decider ? team2 : team1;
                    winners.add(winner);

                    matchesInThisRound.add(Pair.of(winner, loser));
                } else {
                    winners.add(currentTeams.get(i));
                }
            }

            rounds.add(matchesInThisRound);

            currentTeams = winners;
        }

        return rounds;
    }
}
