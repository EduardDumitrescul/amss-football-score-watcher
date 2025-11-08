package com.football.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.football.backend.dto.PlayerSummaryDto;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.models.Player;

@Mapper(
    componentModel = "spring", 
    uses = {TeamMapper.class}
)
public interface PlayerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contracts", ignore = true)
    PlayerEntity toEntity(Player player);

    @Mapping(target = "contracts", ignore = true)
    Player toDomain(PlayerEntity entity);

    @Mapping(target = "fullName", expression = "java(player.getFirstname() + ' ' + player.getLastname())")
    @Mapping(target = "teamName", source = "player.team.name")
    PlayerSummaryDto toSummaryDto(Player player);

    @Mapping(target = "fullName", expression = "java(entity.getFirstname() + ' ' + entity.getLastname())")
    @Mapping(target = "teamName", source = "entity.team.name")
    PlayerSummaryDto toSummaryDto(PlayerEntity entity);
}
