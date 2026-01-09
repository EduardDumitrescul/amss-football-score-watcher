package com.football.backend.models.strategy;

import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.*;

public class RobinRoundStrategy implements Strategy {
    @Override
    public List<List<Pair<Team, Team>>> generateStrategy(List<Team> teams) {
        List<List<Pair<Team, Team>>> rounds = new ArrayList<>();

        if (teams.size() % 2 != 0) {
            return null;
        }

        int numTeams = teams.size();
        int numRounds = numTeams - 1;

        List<Team> tempTeams = new ArrayList<>(teams);

        for (int round = 0; round < numRounds; round++) {
            List<Pair<Team, Team>> matches = new ArrayList<>();

            for (int i = 0; i < numTeams / 2; i++) {
                Team home = tempTeams.get(i);
                Team away = tempTeams.get(numTeams - 1 - i);

                if (home != null && away != null) {
                    matches.add(Pair.of(home, away));
                }
            }

            rounds.add(matches);

            Team last = tempTeams.removeLast();
            tempTeams.add(1, last);
        }

        return rounds;
    }
}
