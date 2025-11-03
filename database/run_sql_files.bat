@echo off
REM Batch script to run SQL files in MySQL
REM Run this from Command Prompt (not PowerShell)
REM Security Note: This script uses mysql_config_editor for secure credential storage.
REM Setup: Run "mysql_config_editor set --login-path=taletrail --host=localhost --user=root --password"
REM and enter your password when prompted. This stores credentials encrypted in ~/.mylogin.cnf

echo ========================================
echo TaleTrail Database Setup Script
echo ========================================
echo.

REM Change to the directory where this script is located
cd /d "%~dp0"

set dbname=taletrail_db

echo NOTE: This script uses mysql_config_editor for secure credential storage.
echo If you haven't set up a login-path yet, run:
echo   mysql_config_editor set --login-path=taletrail --host=localhost --user=root --password
echo.
echo Using login-path: taletrail
echo.
echo Running SQL files...
echo.

echo [1/3] Running sample_data.sql...
mysql --login-path=taletrail %dbname% < "%~dp0sample_data.sql"
if %errorlevel% equ 0 (
    echo SUCCESS: sample_data.sql executed
) else (
    echo ERROR: Failed to execute sample_data.sql
)
echo.

echo [2/3] Running add_more_books.sql...
mysql --login-path=taletrail %dbname% < "%~dp0add_more_books.sql"
if %errorlevel% equ 0 (
    echo SUCCESS: add_more_books.sql executed
) else (
    echo ERROR: Failed to execute add_more_books.sql
)
echo.

echo [3/3] Running add_books_corrected.sql...
mysql --login-path=taletrail %dbname% < "%~dp0add_books_corrected.sql"
if %errorlevel% equ 0 (
    echo SUCCESS: add_books_corrected.sql executed
) else (
    echo ERROR: Failed to execute add_books_corrected.sql
)
echo.

echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Now verify the data:
echo   cd backend
echo   node check-data.js
echo.
pause
