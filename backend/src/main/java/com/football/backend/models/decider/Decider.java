package com.football.backend.models.decider;

import com.football.backend.models.Team;

@FunctionalInterface
public interface Decider {
    Team decideWinner(Team team1, Team team2);
}