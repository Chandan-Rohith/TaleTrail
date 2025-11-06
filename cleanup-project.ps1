# TaleTrail Project Cleanup Script
# This removes unnecessary test files, old documentation, and cleanup scripts

Write-Host "🧹 Starting TaleTrail Project Cleanup..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot

# Files to delete
$filesToDelete = @(
    # Root documentation files
    "CONTENT_BASED_FILTERING_SUMMARY.md",
    "CONTENT_BASED_IMPLEMENTATION.md",
    "CSS_FIXES_APPLIED.md",
    "DATABASE_SETUP.md",
    "DEPLOYMENT_CHECKLIST.md",
    "DEPLOYMENT_FIXES.md",
    "DUPLICATE_BOOKS_FIX.md",
    "DUPLICATE_BOOKS_FIX_SUMMARY.md",
    "HOW_CONTENT_FILTERING_WORKS.md",
    "ML_ISSUES_FOUND_AND_FIXED.md",
    "ML_REMOVAL_SUMMARY.md",
    "ML_SERVICE_DEPLOYMENT.md",
    "ML_SERVICE_STATUS.md",
    "USER_INTERACTIONS_CLEANUP.md",
    "VSCODE_SETUP.md",
    "PROJECT.lnk",
    "start-all.sh",
    
    # Backend test/debug scripts
    "backend\add-favorite-for-user-10.js",
    "backend\assign-genres-to-books.js",
    "backend\check-book-44.js",
    "backend\check-books-with-genres.js",
    "backend\check-data.js",
    "backend\check-tables.js",
    "backend\check-user-17.js",
    "backend\check-user-19.js",
    "backend\check-user-6-detailed.js",
    "backend\check-user-favorites-and-genres.js",
    "backend\check-users-favorites.js",
    "backend\find-user-by-email.js",
    "backend\fix-book-44-genres.js",
    "backend\list-all-books.js",
    "backend\list-all-users.js",
    "backend\list-genres.js",
    "backend\test-db-connection.js",
    "backend\test-env.js",
    "backend\test-parameterized-queries.js",
    "backend\test-recommendations-debug.js",
    "backend\test-user-6-recommendations.js",
    "backend\test-user6-recommendations.js",
    "backend\cleanup-views.js",
    "backend\fix-database-views.js",
    "backend\remove-user-interactions.js",
    "backend\remove-views-permanently.js",
    
    # Database cleanup scripts
    "database\cleanup_unused_views.sql",
    "database\fix_book_44_genres.sql",
    "database\fix_pride_prejudice_cover.sql",
    "database\fix_views_after_cleanup.sql",
    "database\remove_duplicate_books.sql",
    "database\update_all_local_covers.sql",
    "database\update_covers.sql",
    "database\update_local_covers.sql",
    "database\book_covers_download_list.txt",
    "database\cover_images_guide.sql"
)

$deletedCount = 0
$notFoundCount = 0

foreach ($file in $filesToDelete) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "✓ Deleted: $file" -ForegroundColor Green
        $deletedCount++
    } else {
        Write-Host "⊘ Not found: $file" -ForegroundColor DarkGray
        $notFoundCount++
    }
}

# Remove ml-service folder
$mlServicePath = Join-Path $projectRoot "ml-service"
if (Test-Path $mlServicePath) {
    Remove-Item $mlServicePath -Recurse -Force
    Write-Host "✓ Deleted: ml-service\ (entire folder)" -ForegroundColor Green
    $deletedCount++
} else {
    Write-Host "⊘ Not found: ml-service\" -ForegroundColor DarkGray
    $notFoundCount++
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host "   Deleted: $deletedCount items" -ForegroundColor Green
Write-Host "   Not found: $notFoundCount items" -ForegroundColor Yellow
Write-Host ""
Write-Host "📦 Your project is now cleaner!" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ KEPT (essential files):" -ForegroundColor Yellow
Write-Host "   - README.md, SETUP.md, NEXT_STEPS.md"
Write-Host "   - backend/server.js and routes/"
Write-Host "   - database/schema.sql and sample_data.sql"
Write-Host "   - frontend/ (all files)"
Write-Host ""
