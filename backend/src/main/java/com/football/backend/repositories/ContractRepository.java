package com.football.backend.repositories;

import com.football.backend.entities.ContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ContractRepository extends JpaRepository<ContractEntity, UUID> {
    List<ContractEntity> findAllByPlayerId(UUID playerId);
}
