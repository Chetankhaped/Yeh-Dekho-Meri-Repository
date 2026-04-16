@echo off
REM ====================================================================
REM   Deepfake Detection System - Status Script
REM   Check the status of all services
REM ====================================================================

echo.
echo ========================================
echo  System Status Check
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

echo [INFO] Docker is running...
echo.

REM Check container status
echo ========================================
echo  Container Status
echo ========================================
echo.
docker compose -f "%~dp0docker-compose.yml" ps

echo.
echo ========================================
echo  Service Health Checks
echo ========================================
echo.

REM Check Website
echo [1/3] Checking Website...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 5; Write-Host 'Website (Port 8080): [HEALTHY] HTTP' $response.StatusCode } catch { Write-Host 'Website (Port 8080): [NOT RESPONDING]' }"

REM Check Detection Engine
echo [2/3] Checking Detection Engine...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8000/health' -TimeoutSec 5; if ($response.status -eq 'ok') { Write-Host 'Detection Engine (Port 8000): [HEALTHY]' } else { Write-Host 'Detection Engine (Port 8000): [UNHEALTHY]' } } catch { Write-Host 'Detection Engine (Port 8000): [NOT RESPONDING]' }"

REM Check Credits Service
echo [3/3] Checking Credits Service...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8001/health' -TimeoutSec 5; if ($response.status -eq 'ok') { Write-Host 'Credits Service (Port 8001): [HEALTHY]' } else { Write-Host 'Credits Service (Port 8001): [UNHEALTHY]' } } catch { Write-Host 'Credits Service (Port 8001): [NOT RESPONDING]' }"

echo.
echo ========================================
echo  Disk Usage
echo ========================================
echo.
docker system df

echo.
echo ========================================
echo  Quick Commands:
echo ========================================
echo.
echo  View logs:         logs.bat
echo  Start services:    start.bat
echo  Stop services:     stop.bat
echo  Restart services:  restart.bat
echo.

pause
