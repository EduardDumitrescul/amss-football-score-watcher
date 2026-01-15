package com.football.backend.repositories;

import com.football.backend.entities.CompetitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompetitionRepository extends JpaRepository<CompetitionEntity, UUID> {

    Optional<CompetitionEntity> findByName(String championsLeague);
}
