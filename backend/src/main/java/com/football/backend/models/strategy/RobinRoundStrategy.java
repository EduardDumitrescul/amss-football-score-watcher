package com.football.backend.models.strategy;

import com.football.backend.models.Edition;
import com.football.backend.models.Match;
import com.football.backend.models.Team;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class RobinRoundStrategy implements Strategy {
    @Override
    public List<List<Match>> generateStrategy(Edition edition, List<Team> teams) {
        List<List<Match>> rounds = new ArrayList<>();

        if (teams.size() % 2 != 0) {
            return null;
        }

        int numTeams = teams.size();
        int numRounds = numTeams - 1;

        List<Team> tempTeams = new ArrayList<>(teams);

        for (int round = 0; round < numRounds; round++) {
            List<Match> matches = new ArrayList<>();

            for (int i = 0; i < numTeams / 2; i++) {
                Team home = tempTeams.get(i);
                Team away = tempTeams.get(numTeams - 1 - i);

                if (home != null && away != null) {
                    Match m = new Match(UUID.randomUUID(), edition, home, away, null, null, null, null, null);
                    matches.add(m);
                }
            }

            rounds.add(matches);

            Team last = tempTeams.removeLast();
            tempTeams.add(1, last);
        }

        return rounds;
    }
}
