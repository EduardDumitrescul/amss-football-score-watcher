package com.football.backend.models.strategy;

import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.List;

public class KnockoutStrategy implements Strategy{

    @Override
    public List<List<Pair<Team, Team>>> generateStrategy(List<Team> teams) {
        return null;
    }
}
