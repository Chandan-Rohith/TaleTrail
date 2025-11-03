# PowerShell script to run SQL files in order
# Run this script from PowerShell with: .\run_sql_files.ps1

Write-Host "🚀 TaleTrail Database Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for MySQL password
$password = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Database name
$dbName = "taletrail_db"

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
        
        # Read the SQL file content
        $sqlContent = Get-Content $filePath -Raw
        
        # Execute using mysql command
        $sqlContent | mysql -u root -p"$plainPassword" $dbName 2>&1
        
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
