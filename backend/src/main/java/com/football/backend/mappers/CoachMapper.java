package com.football.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import com.football.backend.dto.CoachSummaryDto;
import com.football.backend.entities.CoachEntity;
import com.football.backend.models.Coach;

@Mapper(
    componentModel = "spring", 
    uses = {TeamMapper.class}
)
public interface CoachMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "team", ignore = true)
    CoachEntity toEntity(Coach coach);

    @Mapping(target = "team", ignore = true)
    Coach toDomain(CoachEntity entity);

    @Mapping(target = "fullName", expression = "java(coach.getFirstname() + ' ' + coach.getLastname())")
    CoachSummaryDto toSummaryDto(Coach coach);
    
    @Mapping(target = "fullName", expression = "java(entity.getFirstname() + ' ' + entity.getLastname())")
    CoachSummaryDto toSummaryDto(CoachEntity entity);

}
