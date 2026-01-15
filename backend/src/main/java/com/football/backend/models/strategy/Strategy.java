package com.football.backend.models.strategy;

import com.football.backend.models.Edition;
import com.football.backend.models.Match;
import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.List;

public interface Strategy {
    List<List<Match>> generateStrategy(Edition edition, List<Team> teams);
}
