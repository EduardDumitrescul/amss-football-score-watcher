package com.football.backend.repositories;

import com.football.backend.entities.CoachEntity;
import com.football.backend.entities.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {
    /**
     * Finds a team that is currently assigned to the given coach.
     * Since a coach can only be on one team, this will return one or zero.
     * * @param coach The coach entity to search for.
     * @return An Optional containing the team if found, or empty otherwise.
     */
    Optional<TeamEntity> findByCoach(CoachEntity coach);

    List<TeamEntity> findByCoachIsNull();
}
