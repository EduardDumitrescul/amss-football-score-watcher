package com.football.backend.repositories;

import com.football.backend.entities.PlayerEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // Configures an in-memory H2 DB and scans for @Entity and @Repository
class PlayerRepositoryTest {

    @Autowired
    private TestEntityManager entityManager; // Helper to persist data

    @Autowired
    private PlayerRepository playerRepository; // The repository we are testing

    @Test
    public void whenSavePlayer_thenFindById_shouldReturnPlayer() {
        // Arrange
        PlayerEntity player = PlayerEntity.builder()
                .firstname("Cristiano")
                .lastname("Ronaldo")
                .position("Forward")
                .shirtNumber(7)
                .nationality("Portugal")
                .dateOfBirth(new Date())
                .build();
        
        // Act
        // Use entityManager to save, as it's cleaner in tests
        PlayerEntity savedPlayer = entityManager.persistAndFlush(player);

        // Assert
        Optional<PlayerEntity> foundPlayerOpt = playerRepository.findById(savedPlayer.getId());

        assertThat(foundPlayerOpt).isPresent();
        PlayerEntity foundPlayer = foundPlayerOpt.get();
        assertThat(foundPlayer.getFirstname()).isEqualTo("Cristiano");
        assertThat(foundPlayer.getShirtNumber()).isEqualTo(7);
    }
}
