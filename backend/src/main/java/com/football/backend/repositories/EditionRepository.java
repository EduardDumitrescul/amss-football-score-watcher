package com.football.backend.repositories;

import com.football.backend.entities.EditionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EditionRepository extends JpaRepository<EditionEntity, UUID> {

    List<EditionEntity> findByCompetition_Id(UUID competitionId);
}
