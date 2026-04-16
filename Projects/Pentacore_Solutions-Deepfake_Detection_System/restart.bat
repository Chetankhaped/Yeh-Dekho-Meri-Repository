@echo off
REM ====================================================================
REM   Deepfake Detection System - Restart Script
REM   Restarts all Docker containers for the application
REM ====================================================================

echo.
echo ========================================
echo  Restarting Deepfake Detection System
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [STEP 1/2] Stopping containers...
echo.
docker compose -f "%~dp0docker-compose.yml" down

if errorlevel 1 (
    echo [ERROR] Failed to stop containers!
    pause
    exit /b 1
)

echo.
echo [STEP 2/2] Starting containers...
echo.
docker compose -f "%~dp0docker-compose.yml" up --build -d

if errorlevel 1 (
    echo [ERROR] Failed to start containers!
    echo Run 'docker compose logs' to see error details.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Containers Restarted Successfully!
echo ========================================
echo.

REM Wait for services to be ready
echo [INFO] Waiting for services to initialize...
timeout /t 5 /nobreak >nul

REM Display container status
echo [INFO] Container Status:
echo.
docker compose -f "%~dp0docker-compose.yml" ps

echo.
echo ========================================
echo  Access URLs:
echo ========================================
echo.
echo  Website:           http://localhost:8080
echo  API Documentation: http://localhost:8080/api-docs.html
echo  Engine Health:     http://localhost:8000/health
echo  Credits Health:    http://localhost:8001/health
echo.

pause
