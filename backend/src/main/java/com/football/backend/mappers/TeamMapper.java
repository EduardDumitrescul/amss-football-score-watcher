package com.football.backend.mappers;

import com.football.backend.dto.TeamDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.football.backend.entities.TeamEntity;
import com.football.backend.models.Team;

@Mapper(
    componentModel = "spring",
    uses = {CoachMapper.class}
)
public interface TeamMapper {
    
    @Mapping(target = "id", ignore = true)
    TeamEntity toEntity(Team team);

    Team toDomain(TeamEntity entity);

    TeamDto toTeamDto(Team team);

}
