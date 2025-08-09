# Uni Take Home Assignment

This project is a take-home assignment for Uni. It includes a NestJS application with event-driven architecture using NATS, and it is fully dockerized for development and production environments.

## Dockerized Environments Management

This project uses Docker to create consistent development and production environments. The `Makefile` provides a set of commands to simplify the management of these environments.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- `make`

### Environments

- **Development (`dev`)**: This environment is configured for local development. It uses a development Dockerfile that enables features like hot-reloading. Services are exposed on the host machine for easy access and debugging.

- **Production (`prod`)**: This environment is optimized for production deployment. It uses a multi-stage Dockerfile to create a small, efficient image. It also includes configurations for handling secrets and resource limits.

### Makefile Commands

The `Makefile` in the root of the project provides a convenient way to manage the Docker environments.

#### Help

To see a list of all available commands, run:
```sh
make help
```

#### Development Commands

| Command         | Description                                                                                             |
|-----------------|---------------------------------------------------------------------------------------------------------|
| `make dev-build`  | Builds the Docker image for the development environment. The image will be tagged as `event-system:latest`. |
| `make dev-up`     | Builds the image if it doesn't exist and starts all services for the development environment in detached mode. |
| `make dev-down`   | Stops and removes all containers, networks, and volumes for the development environment.                |
| `make dev-logs`   | Tails the logs from all running services in the development environment.                                |
| `make dev-ps`     | Lists all the running containers for the development environment and their status.                      |
| `make dev-restart`| Restarts all services in the development environment.                                                   |
**Example workflow for development:**
1. Start the environment: `make dev-up`
2. Check the logs: `make dev-logs`
3. Stop the environment: `make dev-down`

#### Production Commands

| Command          | Description                                                                                              |
|------------------|----------------------------------------------------------------------------------------------------------|
| `make prod-build`  | Builds the Docker image for the production environment. The image will be tagged as `event-system:latest`. |
| `make prod-up`     | Builds the image if it doesn't exist and starts all services for the production environment in detached mode. |
| `make prod-down`   | Stops and removes all containers, networks, and volumes for the production environment.                  |
| `make prod-logs`   | Tails the logs from all running services in the production environment.                                  |
| `make prod-ps`     | Lists all the running containers for the production environment and their status.                        |
| `make prod-restart`| Restarts all services in the production environment.                                                     |

**Example workflow for production simulation:**
1. Build the production image: `make prod-build`
2. Start the environment: `make prod-up`
3. Stop the environment: `make prod-down`

#### Cleanup Commands

| Command         | Description                                                                                             |
|-----------------|---------------------------------------------------------------------------------------------------------|
| `make clean`      | Prunes unused Docker resources like dangling images and volumes to free up disk space.                  |
| `make clean-all`  | **DANGEROUS**: Stops all services and removes all containers, volumes, and networks for both environments. This will delete all data. |
