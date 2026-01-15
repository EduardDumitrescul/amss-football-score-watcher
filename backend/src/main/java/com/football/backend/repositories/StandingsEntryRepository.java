package com.football.backend.repositories;

import com.football.backend.entities.StandingsEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StandingsEntryRepository extends JpaRepository<StandingsEntryEntity, UUID> {

    @Query("""
        SELECT s FROM StandingsEntryEntity s 
        WHERE s.standings.edition.id = :editionId
        ORDER BY 
            (s.wins * 3 + s.draws) DESC, 
            (s.goalsFor - s.goalsAgainst) DESC,
            s.goalsFor DESC
    """)
    List<StandingsEntryEntity> findStandingsByEditionId(@Param("editionId") UUID editionId);
}
