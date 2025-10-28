package com.football.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.football.backend.entities.ContractEntity;
import com.football.backend.models.Contract;

@Mapper(
    componentModel = "spring",
    uses = {PlayerMapper.class, TeamMapper.class}
)
public interface ContractMapper {
    
    @Mapping(target = "id", ignore = true)
    ContractEntity toEntity(Contract contract);

    Contract toDomain(ContractEntity entity);
}