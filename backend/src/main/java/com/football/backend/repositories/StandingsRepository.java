package com.football.backend.repositories;

import com.football.backend.entities.StandingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StandingsRepository extends JpaRepository<StandingsEntity, UUID> {
}
