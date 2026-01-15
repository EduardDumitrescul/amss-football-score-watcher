package com.football.backend.repositories;

import com.football.backend.entities.MatchEntity;
import com.football.backend.models.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, UUID> {

    List<MatchEntity> findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime from);

    List<MatchEntity> findByStatusOrderByMatchDateDesc(MatchStatus status);

    List<MatchEntity> findByEditionIdOrderByMatchDateAsc(UUID editionId);

    List<MatchEntity> findByEditionIdAndStatus(UUID editionId, MatchStatus status);
}
