# Blog Application Automation

.PHONY: setup start-db backend frontend run start stop help

# 1. Setup Docker (Rootless)
setup:
	@echo "Installing/Starting Docker Rootless..."
	@zsh ./install-docker-rootless.zsh

# 2. Start Database
start-db:
	@echo "Starting Database via Docker Compose..."
	@docker compose up -d

# 3. Run Backend (Foreground)
backend:
	@echo "Starting Backend (Spring Boot)..."
	@cd backend && ./mvnw spring-boot:run

# 4. Run Frontend (Foreground)
frontend:
	@echo "Starting Frontend (Angular)..."
	@cd frontend && npx ng serve

# 5. Combined Run (Foreground with Logs)
run: start-db
	@echo "Starting full application in foreground..."
	@./start.sh

# 6. One-command Start (Background)
start: start-db
	@echo "Starting full application in background..."
	@echo "Backend logs: backend.log | Frontend logs: frontend.log"
	@cd backend && ./mvnw spring-boot:run > ../backend.log 2>&1 &
	@cd frontend && npx ng serve > ../frontend.log 2>&1 &
	@echo "Apps are starting! Use 'make stop' to kill them."

# 7. Stop everything
stop:
	@echo "Stopping Database..."
	@docker compose down
	@echo "Killing Backend and Frontend processes..."
	@pkill -f 'spring-boot:run' || true
	@pkill -f 'ng serve' || true
	@echo "Cleaned up."

help:
	@echo "Usage:"
	@echo "  make setup       - Install/Fix docker daemon"
	@echo "  make start-db    - Start only the PostgreSQL database"
	@echo "  make run         - Start EVERYTHING in foreground (multiplexed logs)"
	@echo "  make start       - Start EVERYTHING in background"
	@echo "  make stop        - Stop everything"
	@echo "  make backend     - Run Spring Boot only"
	@echo "  make frontend    - Run Angular only"