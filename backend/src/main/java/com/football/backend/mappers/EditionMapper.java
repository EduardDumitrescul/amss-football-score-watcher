package com.football.backend.mappers;

import com.football.backend.entities.EditionEntity;
import com.football.backend.models.Edition;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EditionMapper {

    @Mapping(target = "competitionId", source = "competition.id")
    @Mapping(target = "standings", ignore = true)
    Edition toDomain(EditionEntity entity);

    @InheritInverseConfiguration
    @Mapping(target = "matches", ignore = true)
    @Mapping(target = "competition", ignore = true)
    EditionEntity toEntity(Edition model);
}