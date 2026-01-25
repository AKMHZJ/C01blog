#!/bin/bash

# Blog Application One-Click Start Script

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker compose down
    exit
}

trap cleanup SIGINT SIGTERM

echo "--- 1. Setting up Docker Daemon ---"
zsh ./install-docker-rootless.zsh

echo "--- 2. Starting Database ---"
docker compose up -d

echo "--- 3. Starting Backend (Spring Boot) ---"
cd backend && ./mvnw spring-boot:run &
BACKEND_PID=$!

echo "--- 4. Starting Frontend (Angular) ---"
cd ../frontend && npx ng serve &
FRONTEND_PID=$!

echo "------------------------------------------------"
echo "Both applications are starting in the background."
echo "Press Ctrl+C to stop everything (Apps + Database)."
echo "------------------------------------------------"

# Wait for both processes
wait