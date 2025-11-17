package com.football.backend.models.strategy;

import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.List;

public interface Strategy {
    List<List<Pair<Team, Team>>> generateStrategy(List<Team> teams);
}
