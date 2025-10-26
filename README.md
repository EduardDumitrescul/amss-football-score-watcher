# AMSS-football-score-watcher
An integrated platform for managing and tracking football competitions. Provides read-only access for fans to view schedules, results, and auto-generated standings. Admins have full control to manage competitions, teams, players, and validate scores. Features a core algorithmic engine for generating fixtures (round-robin, knockout).


## Tech Stack:
- React (Nginx) + TypeScript
- Spring Boot (Java)
- MySQL (Database)
- Docker

## Prerequisites

* **Git:** [Download](https://www.google.com/search?q=https://git-scm.com/downloads)

* **Docker Desktop:** [Download](https://www.docker.com/products/docker-desktop/)

## Step 1: Clone the Repository

In your terminal, clone the project and navigate into its directory.

git clone https://github.com/EduardDumitrescul/amss-football-score-watcher.git
cd amss-football-score-watcher

## Step 2: Build and Run the Application

From the project's root folder, run the following command:
```
docker-compose up --build
```


* `docker-compose up`: Starts all services (`db`, `backend`, `frontend`).

* `--build`: Builds the `frontend` and `backend` images. This is required on the first run or after code changes.

Wait for the logs to show the database and Spring Boot application are running (30-60 seconds on first launch).

## Step 3: Access Your Application

* **Frontend (React App):**

  * [**http://localhost**](https://www.google.com/search?q=http://localhost) (or `http://localhost:80`)

* **Database (MySQL Client):**

  * **Host:** `localhost`

  * **Port:** `3306`

  * **Username:** `mysql-user` (from `docker-compose.yml`)

  * **Password:** `mysql-pass` (from `docker-compose.yml`)

  * **Database:** `football-db` (from `docker-compose.yml`)

Your React app will automatically proxy API calls (`/api/...`) to the backend.

## Step 4: Stop the Application

1. Press `Ctrl+C` in the terminal where the app is running.

2. Run the following command to stop and remove all containers:

```
docker-compose down
```

*Note: Your database data is safe. It is stored in a Docker volume (`db-data`) and will be available the next time you run `docker-compose up`.*


# Architecture

## High-Level Architecture

![Architecture](/out/docs/general-architecture/general-architecture.svg)

## Database Entity Relationship Diagram (ERD)

![Database ERD](/out/docs/database/database.svg)
