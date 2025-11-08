package com.football.backend;

import com.football.backend.repositories.TeamRepository;
import com.football.backend.services.DatabaseSeeder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner run(TeamRepository teamRepository, DatabaseSeeder databaseSeeder) {
		return args -> {
			if (teamRepository.count() == 0) {
				databaseSeeder.seedDatabase();
			}
		};
	}
}
