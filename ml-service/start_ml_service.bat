@echo off
echo ============================================================
echo   TaleTrail ML Service Starter
echo ============================================================
echo.

REM Set environment variables
set FLASK_PORT=5000
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=panduorange
set DB_NAME=taletrail_db
set FLASK_DEBUG=0

REM Navigate to ML service directory
cd /d "%~dp0"

echo Starting ML Service on port %FLASK_PORT%...
echo Database: %DB_HOST%/%DB_NAME%
echo.
echo Press Ctrl+C to stop the service
echo ============================================================
echo.

REM Start the Python Flask application
.venv\Scripts\python.exe app.py

REM Pause if there's an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ============================================================
    echo ERROR: ML Service exited with code %ERRORLEVEL%
    echo ============================================================
    pause
)
