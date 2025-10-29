package com.football.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.football.backend.entities.CoachEntity;
import com.football.backend.models.Coach;

@Mapper(
    componentModel = "spring"
)
public interface CoachMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "team", ignore = true)
    CoachEntity toEntity(Coach coach);

    @Mapping(target = "team", ignore = true)
    Coach toDomain(CoachEntity entity);

}
