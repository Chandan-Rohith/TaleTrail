# PowerShell script to run SQL files in order
# Run this script from PowerShell with: .\run_sql_files.ps1
# Security Note: Uses mysql_config_editor for secure credential storage
# Setup: Run "mysql_config_editor set --login-path=taletrail --host=localhost --user=root --password"

Write-Host "🚀 TaleTrail Database Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: This script uses mysql_config_editor for secure credentials." -ForegroundColor Yellow
Write-Host "If not configured, run: mysql_config_editor set --login-path=taletrail --host=localhost --user=root --password" -ForegroundColor Yellow
Write-Host ""

# Database name
$dbName = "taletrail_db"
$loginPath = "taletrail"

# SQL files to run in order
$sqlFiles = @(
    "sample_data.sql",
    "add_more_books.sql",
    "add_books_corrected.sql"
)

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

foreach ($file in $sqlFiles) {
    $filePath = Join-Path $scriptDir $file
    
    if (Test-Path $filePath) {
        Write-Host "📄 Running: $file" -ForegroundColor Yellow
        
        # Execute using mysql with login-path (no password exposure)
        Get-Content $filePath -Raw | mysql --login-path=$loginPath $dbName 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully executed: $file" -ForegroundColor Green
        } else {
            Write-Host "❌ Error executing: $file" -ForegroundColor Red
            Write-Host "   You may need to run this file manually in MySQL Workbench" -ForegroundColor Yellow
        }
        Write-Host ""
    } else {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✨ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run the verification script:" -ForegroundColor Cyan
Write-Host "  cd ..\backend" -ForegroundColor White
Write-Host "  node check-data.js" -ForegroundColor White
Write-Host ""
