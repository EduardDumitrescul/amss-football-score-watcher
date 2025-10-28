package com.football.backend.mappers;

import com.football.backend.models.Player;
import com.football.backend.entities.PlayerEntity;
import com.football.backend.entities.TeamEntity;
import com.football.backend.entities.ContractEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest // Loads the full application context, including MapStruct mappers
class PlayerMapperTest {

    @Autowired
    private PlayerMapper playerMapper;

    @Test
    void shouldMapEntityToDomain_withNestedObjects() {
        // Arrange
        TeamEntity teamEntity = TeamEntity.builder()
                .id(UUID.randomUUID())
                .name("FC Barcelona")
                .build();
        
        PlayerEntity playerEntity = PlayerEntity.builder()
                .id(UUID.randomUUID())
                .firstname("Andres")
                .position("Midfielder")
                .lastname("Iniesta")
                .team(teamEntity)
                .build();
        
        ContractEntity contractEntity = ContractEntity.builder()
                .id(UUID.randomUUID())
                .startDate(new Date())
                .endDate(new Date())
 .salaryPerYear(10000000)
                .player(playerEntity)
                .team(teamEntity)
                .build();
        
        Set<ContractEntity> contracts = new HashSet<>();
        contracts.add(contractEntity);
        playerEntity.setContracts(contracts);

        // Act
        Player playerDomain = playerMapper.toDomain(playerEntity);

        // Assert
        assertThat(playerDomain).isNotNull();
        assertThat(playerDomain.getId()).isEqualTo(playerEntity.getId());
        assertThat(playerDomain.getLastname()).isEqualTo("Iniesta");
        
        assertThat(playerDomain.getTeam()).isNotNull();
        assertThat(playerDomain.getTeam().getName()).isEqualTo("FC Barcelona");
        // Verify other fields that were set
        assertThat(playerDomain.getPosition()).isEqualTo("Midfielder");
        
        assertThat(playerDomain.getContracts()).isNull();
    }

    @Test
    void shouldMapDomainToEntity() {
        // Arrange
        Player playerDomain = new Player(
            null, 
            "Kevin", 
            "De Bruyne", 
            null,
            null, 
            "Belgium", 
            null, 
            null, 
            null
        );
        // We're not setting ID, team, or contracts for a new player
        
        // Act
        PlayerEntity playerEntity = playerMapper.toEntity(playerDomain);

        // Assert
        assertThat(playerEntity).isNotNull();
        assertThat(playerEntity.getId()).isNull(); // ID is null, as expected for a new player
        assertThat(playerEntity.getFirstname()).isEqualTo("Kevin");
        assertThat(playerEntity.getNationality()).isEqualTo("Belgium");
        
        // We ignored contracts in the mapper, so this should be null
        assertThat(playerEntity.getContracts()).isNull(); 
    }
}
