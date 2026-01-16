package com.football.backend.models.strategy;

import com.football.backend.models.Edition;
import com.football.backend.models.Match;
import com.football.backend.models.MatchStatus;
import com.football.backend.models.Team;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class RobinRoundDoubleStrategy implements Strategy {

    private final Strategy singleStrategy = new RobinRoundStrategy();

    @Override
    public List<List<Match>> generateStrategy(Edition edition, List<Team> teams) {
        List<List<Match>> firstHalfRounds = singleStrategy.generateStrategy(edition, teams);
        List<List<Match>> allRounds = new ArrayList<>(firstHalfRounds);

        for (List<Match> round : firstHalfRounds) {
            List<Match> returnRound = new ArrayList<>();
            for (Match match : round) {
                Match returnMatch = new Match(
                        UUID.randomUUID(),
                        edition,
                        match.getAwayTeam(),
                        match.getHomeTeam(),
                        null,
                        null,
                        null,
                        MatchStatus.SCHEDULED,
                        new ArrayList<>()
                );
                returnRound.add(returnMatch);
            }
            allRounds.add(returnRound);
        }

        LocalDateTime matchDate = LocalDateTime.now().plusHours(3).withMinute(0).withSecond(0).withNano(0);
        List<List<Match>> finalSchedule = new ArrayList<>();

        for (List<Match> round : allRounds) {
            List<Match> scheduledRound = new ArrayList<>();
            for (Match match : round) {
                Match scheduledMatch = new Match(
                        match.getId() != null ? match.getId() : UUID.randomUUID(),
                        edition,
                        match.getHomeTeam(),
                        match.getAwayTeam(),
                        matchDate,
                        null,
                        null,
                        MatchStatus.SCHEDULED,
                        new ArrayList<>()
                );
                scheduledRound.add(scheduledMatch);
            }
            finalSchedule.add(scheduledRound);
            matchDate = matchDate.plusWeeks(1);
        }

        return finalSchedule;
    }

}
