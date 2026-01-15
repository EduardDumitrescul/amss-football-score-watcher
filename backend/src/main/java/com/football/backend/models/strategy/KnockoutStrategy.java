package com.football.backend.models.strategy;

import com.football.backend.models.Edition;
import com.football.backend.models.Match;
import com.football.backend.models.Team;
import com.football.backend.models.decider.Decider;

import java.util.*;

public class KnockoutStrategy implements Strategy{

    private final Decider decider;
    public KnockoutStrategy(Decider decider) {
        this.decider = decider;
    }
    @Override
    public List<List<Match>> generateStrategy(Edition edition, List<Team> teams) {
        List<List<Match>> rounds = new ArrayList<>();

        List<Team> currentTeams = new ArrayList<>(teams);
        Collections.shuffle(currentTeams);

        Random random = new Random();

        while (currentTeams.size() > 1) {
            List<Match> matchesInThisRound = new ArrayList<>();
            List<Team> winners = new ArrayList<>();

            for (int i = 0; i < currentTeams.size(); i += 2) {

                if (i + 1 < currentTeams.size()) {
                    Team team1 = currentTeams.get(i);
                    Team team2 = currentTeams.get(i + 1);

                    Team winner = decider.decideWinner(team1, team2);
                    winners.add(winner);

                    Match m = new Match(UUID.randomUUID(), edition, team1, team2, null, null, null, null, null);
                    matchesInThisRound.add(m);
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
