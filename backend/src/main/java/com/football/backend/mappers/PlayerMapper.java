package com.football.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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
}
