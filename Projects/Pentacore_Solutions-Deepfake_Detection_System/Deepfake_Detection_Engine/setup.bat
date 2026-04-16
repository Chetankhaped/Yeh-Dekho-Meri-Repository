@echo off
REM Quick Setup Script for Multi-Model Deepfake Detection (Windows)

echo ================================================================
echo   Multi-Model Deepfake Detection - Quick Setup
echo ================================================================
echo.

REM Step 1: Check Python
echo Step 1: Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.8+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo [OK] Found: %PYTHON_VERSION%
echo.

REM Step 2: Install dependencies
echo Step 2: Installing dependencies...
cd /d "%~dp0app"
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    cd /d "%~dp0"
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully
cd /d "%~dp0"
echo.

REM Step 3: Verify model files
echo Step 3: Verifying model files...

set "MODEL_FILES=%~dp0model\efficientnet_b4_deepfake.h5"
set "MODEL_FILES=%MODEL_FILES%;%~dp0model\Res_01_FINAL.keras"
set "MODEL_FILES=%MODEL_FILES%;%~dp0model\Res_02_FINAL.keras"
set "MODEL_FILES=%MODEL_FILES%;%~dp0model\VGG_01_FINAL.keras"
set "MODEL_FILES=%MODEL_FILES%;%~dp0model\VGG_2_FINAL.h5"
set "MODEL_FILES=%MODEL_FILES%;%~dp0model\ICV3_FINAL.keras"
set "MODEL_FILES=%MODEL_FILES%;%~dp0model\best_pinpoint_model_antisocial.pth"

set ALL_FOUND=1
for %%f in ("%MODEL_FILES:;=" "%") do (
    if exist %%f (
        echo [OK] %%~f
    ) else (
        echo [ERROR] Missing: %%~f
        set ALL_FOUND=0
    )
)

if %ALL_FOUND%==0 (
    echo.
    echo [WARNING] Some model files are missing!
    echo Please ensure all model files are in the correct locations.
    pause
    exit /b 1
)
echo.

REM Step 4: Run tests
echo Step 4: Running system tests...
cd /d "%~dp0"
python test_multi_model.py
if errorlevel 1 (
    echo [WARNING] Some tests failed. Check the output above.
) else (
    echo [OK] All tests passed!
)
echo.

REM Step 5: Show next steps
echo ================================================================
echo   Setup Complete!
echo ================================================================
echo.
echo Next Steps:
echo.
echo 1. Start the server:
echo    cd /d "%~dp0app"
echo    python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
echo.
echo 2. Test the health endpoint:
echo    curl http://localhost:8001/health
echo.
echo 3. Test with a video:
echo    curl -X POST "http://localhost:8001/predict_multi" ^
echo      -F "file=@your_video.mp4" ^
echo      -F "use_ensemble=true"
echo.
echo 4. Open the analysis notebook:
echo    jupyter notebook "%~dp0notebooks\Model_Comparison_Analysis.ipynb"
echo.
echo Documentation:
echo    * MULTI_MODEL_INTEGRATION.md - Complete guide
echo    * IMPLEMENTATION_COMPLETE.md - Summary
echo    * QUICK_REFERENCE.txt - Quick commands
echo.
echo ================================================================
echo.
pause
