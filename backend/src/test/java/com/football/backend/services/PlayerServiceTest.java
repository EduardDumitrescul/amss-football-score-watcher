package com.football.backend.services;

import com.football.backend.models.Player;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.mappers.PlayerMapper;
import com.football.backend.repositories.PlayerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

    @Mock
    private PlayerRepository playerRepository; // Mocked

    @Mock
    private PlayerMapper playerMapper; // Mocked

    @InjectMocks
    private PlayerService playerService; // The class we are testing

    private Player playerDomain;
    private PlayerEntity playerEntity;
    private UUID testUuid;

    @BeforeEach
    void setUp() {
        testUuid = UUID.randomUUID();
        
        // A domain object for creating a new player
        playerDomain = new Player(
            null, 
            "Lionel", 
            "Messi", 
            null,
            null, 
            null, 
            null, 
            null, 
            null
        );


        // An entity object as it would come from the DB
        playerEntity = PlayerEntity.builder()
                .id(testUuid)
                .firstname("Lionel")
                .lastname("Messi")
                .build();
    }

    @Test
    void getPlayerById_shouldReturnPlayer_whenFound() {
        // Arrange
        when(playerRepository.findById(testUuid)).thenReturn(Optional.of(playerEntity));
        // Mock the domain object that the mapper will return
        Player mappedDomain = new Player(testUuid, "Lionel", "Messi", null, null, null, null, null, null);
        when(playerMapper.toDomain(playerEntity)).thenReturn(mappedDomain);

        // Act
        Player foundPlayer = playerService.getPlayerById(testUuid);

        // Assert
        assertThat(foundPlayer).isNotNull();
        assertThat(foundPlayer.getId()).isEqualTo(testUuid);
        assertThat(foundPlayer.getFirstname()).isEqualTo("Lionel");
        verify(playerRepository).findById(testUuid);
        verify(playerMapper).toDomain(playerEntity);
    }

    @Test
    void getPlayerById_shouldThrowException_whenNotFound() {
        // Arrange
        when(playerRepository.findById(testUuid)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> playerService.getPlayerById(testUuid))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Player not found with id:");
    }

    @Test
    void addPlayer_shouldSaveAndReturnPlayer_whenDataIsValid() {
        // Arrange
        PlayerEntity entityToSave = new PlayerEntity(); // Has null ID
        PlayerEntity savedEntity = playerEntity; // Has ID
        Player mappedDomain = new Player(testUuid, "Lionel", "Messi", null, null, null, null, null, null);

        when(playerMapper.toEntity(playerDomain)).thenReturn(entityToSave);
        when(playerRepository.save(entityToSave)).thenReturn(savedEntity);
        when(playerMapper.toDomain(savedEntity)).thenReturn(mappedDomain);

        // Act
        Player newPlayer = playerService.addPlayer(playerDomain);

        // Assert
        assertThat(newPlayer).isNotNull();
        assertThat(newPlayer.getId()).isEqualTo(testUuid); // The ID is now set
        verify(playerRepository).save(entityToSave);
    }

    @Test
    void addPlayer_shouldThrowException_whenPlayerHasId() {
        // Arrange
        // Create a player *with* an ID
        Player playerWithId = new Player(testUuid, "Lionel", "Messi", null, null, null, null, null, null);

        // Act & Assert
        assertThatThrownBy(() -> playerService.addPlayer(playerWithId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("New player must have a null ID.");
    }
}
