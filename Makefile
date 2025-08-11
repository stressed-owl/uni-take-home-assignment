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
DEV_COMPOSE = docker-compose -f deployment/compose/docker-compose.yml -f deployment/compose/docker-compose.dev.yml --env-file .env.dev
PROD_COMPOSE = docker-compose -f deployment/compose/docker-compose.yml -f deployment/compose/docker-compose.prod.yml --env-file .env.prod

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
	@echo "  dev-build             - Builds all development service images."
	@echo "  dev-up                - Builds and starts the development environment."
	@echo "  dev-down              - Stops and removes development containers."
	@echo "  dev-logs [service=...] - Tails logs for dev. Specify a service or view all."
	@echo "  dev-ps                - Shows the status of containers in the dev environment."
	@echo ""
	@echo "  --- Production ---"
	@echo "  prod-build            - Builds all production service images."
	@echo "  prod-up               - Builds and starts the production environment."
	@echo "  prod-down             - Stops and removes production containers."
	@echo "  prod-logs [service=...] - Tails logs for prod. Specify a service or view all."
	@echo "  prod-ps               - Shows the status of containers in the prod environment."
	@echo ""
	@echo "  --- Cleanup ---"
	@echo "  clean                 - Prunes stopped containers and dangling volumes/images."
	@echo "  clean-all             - DANGER: Stops all envs and removes all docker data."
	@echo ""

# ====================================================================================
# Development Environment Commands
# ====================================================================================

dev-build:
	@echo "Building Docker images for development..."
	$(DEV_COMPOSE) build

dev-up:
	@echo "Starting development environment..."
	$(DEV_COMPOSE) up -d --build

dev-down:
	@echo "Stopping development environment..."
	$(DEV_COMPOSE) down --remove-orphans

dev-logs:
	@echo "Tailing logs for development environment..."
	$(DEV_COMPOSE) logs -f $(service)

dev-ps:
	@echo "Checking status of development environment..."
	$(DEV_COMPOSE) ps

# ====================================================================================
# Production Environment Commands
# ====================================================================================

prod-build:
	@echo "Building Docker images for production..."
	$(PROD_COMPOSE) build

prod-up:
	@echo "Starting production environment..."
	$(PROD_COMPOSE) up -d --build

prod-down:
	@echo "Stopping production environment..."
	$(PROD_COMPOSE) down --remove-orphans

prod-logs:
	@echo "Tailing logs for production environment..."
	$(PROD_COMPOSE) logs -f $(service)

prod-ps:
	@echo "Checking status of production environment..."
	$(PROD_COMPOSE) ps

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