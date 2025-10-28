# Use the Maven image, as we'll run from source
FROM maven:3-eclipse-temurin-21
WORKDIR /app

# Copy pom.xml and download dependencies first for caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of your source code
COPY src ./src

# Expose the Spring Boot port
EXPOSE 8080

# Run the app using the Spring Boot plugin
# This will listen for file changes and restart
CMD ["mvn", "spring-boot:run"]