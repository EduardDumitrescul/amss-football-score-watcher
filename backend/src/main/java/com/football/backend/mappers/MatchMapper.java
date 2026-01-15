package com.football.backend.mappers;

import com.football.backend.dto.MatchDetailsDto;
import com.football.backend.dto.MatchListDto;
import com.football.backend.models.MatchEvent;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.football.backend.entities.MatchEntity;
import com.football.backend.models.Match;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = { MatchEventMapper.class, TeamMapper.class }
)
public interface MatchMapper {

    Match toDomain(MatchEntity entity);

    @InheritInverseConfiguration
    @Mapping(target = "edition", ignore = true)
    @Mapping(target = "events", ignore = true)
    MatchEntity toEntity(Match model);

    @Mapping(target = "homeTeamName", source = "homeTeam.name")
    @Mapping(target = "awayTeamName", source = "awayTeam.name")
    @Mapping(target = "status", expression = "java(match.getStatus().name())")
    MatchListDto toListDto(Match match);

    @Mapping(target = "id", source = "match.id")
    @Mapping(target = "homeTeam", source = "match.homeTeam")
    @Mapping(target = "awayTeam", source = "match.awayTeam")
    @Mapping(target = "matchDate", source = "match.matchDate")
    @Mapping(target = "homeGoals", source = "match.homeGoals")
    @Mapping(target = "awayGoals", source = "match.awayGoals")
    @Mapping(target = "status", expression = "java(match.getStatus().name())")
    @Mapping(target = "events", source = "events")
    MatchDetailsDto toMatchDetailsDto(Match match, List<MatchEvent> events);
}
