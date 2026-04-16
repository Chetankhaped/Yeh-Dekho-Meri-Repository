@echo off
REM ====================================================================
REM   Deepfake Detection System - Clean Script
REM   Remove containers, images, and volumes
REM ====================================================================

echo.
echo ========================================
echo  Docker Cleanup Utility
echo ========================================
echo.
echo WARNING: This will remove:
echo   - All stopped containers
echo   - All unused images
echo   - All unused volumes
echo   - Build cache
echo.
echo This action cannot be undone!
echo.

set /p confirm="Are you sure you want to proceed? (y/N): "
if /i not "%confirm%"=="y" (
    echo.
    echo Cleanup cancelled.
    echo.
    pause
    exit /b 0
)

echo.
echo [INFO] Cleaning up Docker resources...
echo.

REM Stop all containers first
echo [STEP 1/4] Stopping containers...
docker compose -f "%~dp0docker-compose.yml" down

REM Remove unused containers
echo [STEP 2/4] Removing containers...
docker container prune -f

REM Remove unused images
echo [STEP 3/4] Removing images...
docker image prune -a -f

REM Remove unused volumes
echo [STEP 4/4] Removing volumes...
docker volume prune -f

echo.
echo ========================================
echo  Cleanup Complete!
echo ========================================
echo.
echo Disk space freed:
docker system df

echo.
echo Run 'start.bat' to rebuild and start services.
echo.

pause
