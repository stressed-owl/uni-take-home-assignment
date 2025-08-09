# ====================================================================================
# Makefile for Dockerized Environments
#
# This Makefile provides commands to manage the Docker environments for this project.
# It simplifies tasks like starting, stopping, and debugging the services for
# both development and production.
# ====================================================================================

# ------------------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------------------
# Image Name
IMAGE_NAME = event-system

# Dockerfiles
DEV_DOCKERFILE = src/docker/dev/Dockerfile
PROD_DOCKERFILE = src/docker/prod/Dockerfile

# Docker Compose files
BASE_COMPOSE_FILE = src/docker/base/docker-compose.yml
DEV_COMPOSE_FILE = src/docker/dev/docker-compose.dev.yml
PROD_COMPOSE_FILE = src/docker/prod/docker-compose.prod.yml

# Combined compose file flags
DEV_COMPOSE_FILES = -f $(BASE_COMPOSE_FILE) -f $(DEV_COMPOSE_FILE)
PROD_COMPOSE_FILES = -f $(BASE_COMPOSE_FILE) -f $(PROD_COMPOSE_FILE)

# Shell for exec commands
SHELL_CMD = sh

# ====================================================================================
# Help Target
# ====================================================================================

.PHONY: help dev-build dev-up dev-down dev-logs dev-ps prod-build prod-up prod-down prod-logs prod-ps prod-restart clean clean-all
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  help                  - Shows this help message."
	@echo ""
	@echo "  --- Development ---"
	@echo "  dev-build             - Builds the development Docker image."
	@echo "  dev-up                - Builds and starts the development environment."
	@echo "  dev-down              - Stops the development environment."
	@echo "  dev-logs              - Tails the logs of the development environment."
	@echo "  dev-ps                - Shows the status of containers in the dev environment."
	@echo "  dev-restart           - Restarts the development environment."
	@echo ""
	@echo "  --- Production ---"
	@echo "  prod-build            - Builds the production Docker image."
	@echo "  prod-up               - Builds and starts the production environment."
	@echo "  prod-down             - Stops the production environment."
	@echo "  prod-logs             - Tails the logs of the production environment."
	@echo "  prod-ps               - Shows the status of containers in the prod environment."
	@echo "  prod-restart          - Restarts the production environment."
	@echo ""

# ====================================================================================
# Development Environment Commands
# ====================================================================================

dev-build:
	@echo "Building Docker image for development (tag: $(IMAGE_NAME):latest)..."
	docker build -t $(IMAGE_NAME) -f $(DEV_DOCKERFILE) .

dev-up: dev-build
	@echo "Starting development environment..."
	docker-compose $(DEV_COMPOSE_FILES) up -d

dev-down:
	@echo "Stopping development environment..."
	docker-compose $(DEV_COMPOSE_FILES) down --remove-orphans

dev-logs:
	@echo "Tailing logs for development environment..."
	docker-compose $(DEV_COMPOSE_FILES) logs -f

dev-ps:
	@echo "Checking status of development environment..."
	docker-compose $(DEV_COMPOSE_FILES) ps

dev-restart:
	@echo "Restarting development environment..."
	docker-compose $(DEV_COMPOSE_FILES) restart

# ====================================================================================
# Production Environment Commands
# ====================================================================================

.PHONY: prod-build
prod-build:
	@echo "Building Docker image for production (tag: $(IMAGE_NAME):latest)..."
	docker build -t $(IMAGE_NAME) -f $(PROD_DOCKERFILE) .

.PHONY: prod-up
prod-up: prod-build
	@echo "Starting production environment..."
	docker-compose $(PROD_COMPOSE_FILES) up -d

.PHONY: prod-down
prod-down:
	@echo "Stopping production environment..."
	docker-compose $(PROD_COMPOSE_FILES) down --remove-orphans

.PHONY: prod-logs
prod-logs:
	@echo "Tailing logs for production environment..."
	docker-compose $(PROD_COMPOSE_FILES) logs -f

.PHONY: prod-ps
prod-ps:
	@echo "Checking status of production environment..."
	docker-compose $(PROD_COMPOSE_FILES) ps

.PHONY: prod-restart
prod-restart:
	@echo "Restarting production environment..."
	docker-compose $(PROD_COMPOSE_FILES) restart

# ====================================================================================
# Cleanup Commands
# ====================================================================================
clean:
	@echo "Cleaning up..."
	docker system prune -f
	docker volume prune -f

clean-all:
	@echo "WARNING: This will remove ALL Docker data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose $(PROD_COMPOSE_FILES) down -v --remove-orphans
	docker compose $(DEV_COMPOSE_FILES) down -v --remove-orphans
	docker system prune -af --volumes