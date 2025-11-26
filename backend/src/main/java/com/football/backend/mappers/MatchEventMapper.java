package com.football.backend.mappers;

import com.football.backend.dto.MatchEventDto;
import com.football.backend.entities.MatchEventEntity;
import com.football.backend.models.MatchEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = { PlayerMapper.class }
)
public interface MatchEventMapper {

    @Mapping(target = "matchId", source = "match.id")
    MatchEvent toDomain(MatchEventEntity entity);

    @Mapping(target = "match", ignore = true)
    MatchEventEntity toEntity(MatchEvent model);

    @Mapping(target = "type", expression = "java(event.getType().name())")
    @Mapping(target = "primaryPlayerId", source = "primaryPlayer.id")
    @Mapping(
            target = "primaryPlayerName",
            expression = "java(event.getPrimaryPlayer() != null ? event.getPrimaryPlayer().getFirstname() + \" \" + event.getPrimaryPlayer().getLastname() : null)"
    )
    @Mapping(target = "secondaryPlayerId", source = "secondaryPlayer.id")
    @Mapping(
            target = "secondaryPlayerName",
            expression = "java(event.getSecondaryPlayer() != null ? event.getSecondaryPlayer().getFirstname() + \" \" + event.getSecondaryPlayer().getLastname() : null)"
    )
    MatchEventDto toEventDto(MatchEvent event);
}
