# Energizou Registrations Backend

A platform for customers managment built with NestJS and React. It was developed during a technical test of a [Energizou](https://www.linkedin.com/company/energizou/) selection process.

## Requirements

- Docker and Docker Compose (instalation guide [here](https://docs.docker.com/compose/install/))

## Instalation

In order to run the project locally, run

```bash
# define the compose file
$ export COMPOSE_FILE=docker-compose.development

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
# Open a shell inside the container
$ docker compose exec -it nest bash

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
