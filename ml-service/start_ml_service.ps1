# TaleTrail ML Service Startup Script
Write-Host "🚀 Starting TaleTrail ML Service..." -ForegroundColor Green

# Set environment variables
$env:FLASK_PORT = "5000"
$env:DB_HOST = "localhost"
$env:DB_USER = "root"
$env:DB_PASSWORD = "panduorange"
$env:DB_NAME = "taletrail_db"
$env:FLASK_DEBUG = "0"

# Navigate to ML service directory
$mlServicePath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $mlServicePath

Write-Host "📍 Working directory: $mlServicePath" -ForegroundColor Cyan
Write-Host "🔧 Environment:" -ForegroundColor Cyan
Write-Host "   - Port: 5000" -ForegroundColor Gray
Write-Host "   - Database: $env:DB_HOST/$env:DB_NAME" -ForegroundColor Gray
Write-Host ""

# Start the ML service
Write-Host "▶️  Starting Flask application..." -ForegroundColor Yellow
& ".\.venv\Scripts\python.exe" app.py

# Keep script open if there's an error
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ML Service exited with error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
