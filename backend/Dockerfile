# Stage 1: Build the application
# Use a base image with Maven and Java 21
FROM maven:3-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /app

# Copy the build file (pom.xml)
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Build the application and create the .jar file
# This runs 'mvn package' and skips tests
RUN mvn clean package -DskipTests

# Stage 2: Create the final, lightweight image
# Use a minimal Java 21 runtime
FROM openjdk:21-slim

# Set the working directory
WORKDIR /app

# Copy the executable .jar file from the 'build' stage
# Make sure the .jar file name matches what Maven creates
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]