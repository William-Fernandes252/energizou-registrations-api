# Energizou Registrations Backend

A platform for customers managment built with NestJS and React. It was developed during a technical test of a [Energizou](https://www.linkedin.com/company/energizou/) selection process.

## Requirements

- Docker and Docker Compose (instalation guide [here](https://docs.docker.com/compose/install/))

## Instalation

In order to run the project locally, run

```bash
# define the compose file
$ export COMPOSE_FILE=docker-compose.development.yml

# build the containers
$ docker compose up -d --build
```

## Running the app

```bash
# development
$ docker compose up
```

## Test

```bash
# unit tests
$ docker compose exec -it nest npm run test

# e2e tests
$ docker compose exec -it nest npm run test:e2e

# test coverage
$ docker compose exec -it nest npm run test:cov
```
