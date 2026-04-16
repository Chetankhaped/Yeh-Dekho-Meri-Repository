@echo off
REM ====================================================================
REM   Deepfake Detection System - Logs Script
REM   View real-time logs from Docker containers
REM ====================================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

REM Check if a specific service was requested
if "%1"=="" (
    REM No service specified - show all logs
    echo.
    echo ========================================
    echo  Viewing All Container Logs
    echo ========================================
    echo.
    echo Press Ctrl+C to stop viewing logs
    echo.
    timeout /t 2 /nobreak >nul
    docker compose logs -f
) else (
    REM Specific service requested
    echo.
    echo ========================================
    echo  Viewing Logs for: %1
    echo ========================================
    echo.
    echo Press Ctrl+C to stop viewing logs
    echo.
    timeout /t 2 /nobreak >nul
    docker compose -f "%~dp0docker-compose.yml" logs -f %1
)
