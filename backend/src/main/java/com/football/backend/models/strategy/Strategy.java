package com.football.backend.models.strategy;

import com.football.backend.models.Match;
import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.List;

public interface Strategy {
    List<List<Match>> generateStrategy(List<Team> teams);
}
