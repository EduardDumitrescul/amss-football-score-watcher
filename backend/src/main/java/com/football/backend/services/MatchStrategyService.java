package com.football.backend.services;

import com.football.backend.models.Team;
import com.football.backend.models.decider.Decider;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MatchStrategyService implements Decider {

    private final TeamPowerService teamPowerService;
    private final Random random = new Random();

    @Override
    public Team decideWinner(Team team1, Team team2) {
        String id1 = team1.getId().toString();
        String id2 = team2.getId().toString();

        // Alegem un criteriu random de la 0 la 5 (6 criterii)
        int criterion = random.nextInt(6);

        double score1 = 0;
        double score2 = 0;

        switch (criterion) {
            case 0: // Criteriul: Putere Totală
                score1 = teamPowerService.calculateTotalTeamPower(id1);
                score2 = teamPowerService.calculateTotalTeamPower(id2);
                break;
            case 1: // Criteriul: Bani (Team Evaluation)
                score1 = teamPowerService.calculateFinancialEvaluationScore(id1);
                score2 = teamPowerService.calculateFinancialEvaluationScore(id2);
                break;
            case 2: // Criteriul: Vârstă (Average Age)
                score1 = teamPowerService.calculateAverageAgeScore(id1); // Presupunând că ai adaptat metoda să ia ID
                score2 = teamPowerService.calculateAverageAgeScore(id2);
                break;
            case 3: // Criteriul: Chimie (Cohesion)
                score1 = teamPowerService.calculateCohesionScore(id1);
                score2 = teamPowerService.calculateCohesionScore(id2);
                break;
            case 4: // Criteriul: Tactică
                score1 = teamPowerService.calculateTacticalBalanceScore(id1);
                score2 = teamPowerService.calculateTacticalBalanceScore(id2);
                break;
            case 5: // Criteriul: Rezerve (Depth)
                score1 = teamPowerService.calculateSquadDepthScore(id1);
                score2 = teamPowerService.calculateSquadDepthScore(id2);
                break;
        }

        // Comparăm scorurile pe criteriul ales
        if (score1 > score2) {
            return team1;
        } else if (score2 > score1) {
            return team2;
        } else {
            // Egalitate perfectă pe acel criteriu? Dăm cu banul.
            return random.nextBoolean() ? team1 : team2;
        }
    }
}