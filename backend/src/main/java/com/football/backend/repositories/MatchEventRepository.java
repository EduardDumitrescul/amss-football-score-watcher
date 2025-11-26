package com.football.backend.repositories;

import com.football.backend.entities.MatchEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MatchEventRepository extends JpaRepository<MatchEventEntity, UUID> {
}