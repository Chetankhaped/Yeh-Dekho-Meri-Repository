@echo off
REM ====================================================================
REM   Deepfake Detection System - Stop Script
REM   Stops all Docker containers for the application
REM ====================================================================

echo.
echo ========================================
echo  Stopping Deepfake Detection System
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

echo [INFO] Stopping containers...
echo.

REM Stop all services
docker compose -f "%~dp0docker-compose.yml" down

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to stop containers!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Containers Stopped Successfully!
echo ========================================
echo.

REM Display remaining containers (should be none)
echo [INFO] Checking for running containers...
docker compose -f "%~dp0docker-compose.yml" ps

echo.
echo All services have been stopped.
echo Run 'start.bat' to start them again.
echo.

pause
