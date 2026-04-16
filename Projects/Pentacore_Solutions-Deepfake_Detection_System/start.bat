@echo off
REM ====================================================================
REM   Deepfake Detection System - Start Script
REM   Starts all Docker containers for the application
REM ====================================================================

echo.
echo ========================================
echo  Starting Deepfake Detection System
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

REM Check and create required .env files
echo [INFO] Checking environment files...

REM 1. Root .env for website
if not exist "%~dp0.env" (
    echo [WARNING] Root .env file not found!
    echo Creating from .env.development.example...
    copy "%~dp0.env.development.example" "%~dp0.env" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to create root .env file
        pause
        exit /b 1
    )
    echo [SUCCESS] Root .env file created
)

REM 2. Credits_And_Payment/.env
if not exist "%~dp0Credits_And_Payment\.env" (
    echo [WARNING] Credits_And_Payment\.env file not found!
    echo Creating from .env.example...
    copy "%~dp0Credits_And_Payment\.env.example" "%~dp0Credits_And_Payment\.env" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to create Credits_And_Payment\.env file
        pause
        exit /b 1
    )
    echo [SUCCESS] Credits_And_Payment\.env file created
)

REM 3. AWS/.env
if not exist "%~dp0AWS\.env" (
    echo [WARNING] AWS\.env file not found!
    echo Creating from .env.example...
    copy "%~dp0AWS\.env.example" "%~dp0AWS\.env" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to create AWS\.env file
        pause
        exit /b 1
    )
    echo [SUCCESS] AWS\.env file created
    echo [INFO] Remember to configure AWS credentials in AWS\.env if needed
)

echo [OK] All environment files ready
echo.

echo [INFO] Building and starting containers...
echo This may take a few minutes on first run...
echo.

REM Start all services
docker compose -f "%~dp0docker-compose.yml" up --build -d

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start containers!
    echo Run 'docker compose logs' to see error details.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Containers Started Successfully!
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
echo ========================================
echo  Quick Commands:
echo ========================================
echo.
echo  View logs:         logs.bat
echo  Stop services:     stop.bat
echo  Restart services:  restart.bat
echo.
echo ========================================

echo.
echo [INFO] Opening website in your default browser...
timeout /t 2 /nobreak >nul
start http://localhost:8080

echo.
pause
