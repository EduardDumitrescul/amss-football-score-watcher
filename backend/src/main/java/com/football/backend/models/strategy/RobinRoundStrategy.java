package com.football.backend.models.strategy;

import com.football.backend.models.Team;
import org.springframework.data.util.Pair;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

public class RobinRoundStrategy implements Strategy {
    @Override
    public List<List<Pair<Team, Team>>> generateStrategy(List<Team> teams) {
        return null;
    }
}
