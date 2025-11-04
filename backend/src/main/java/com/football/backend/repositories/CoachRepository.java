package com.football.backend.repositories;

import com.football.backend.entities.CoachEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for the CoachEntity.
 * This provides all standard CRUD operations (save, findById, findAll, delete, etc.)
 * out of the box.
 */
@Repository
public interface CoachRepository extends JpaRepository<CoachEntity, UUID> {

}
