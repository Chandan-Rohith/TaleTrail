# Duplicate Books Issue - Summary & Fix

## Problem
Books appear multiple times in the "Trending Books" section because the **database contains duplicate records**.

## Root Cause
The database has multiple entries for the same book (same title + author). For example:
- **Pride and Prejudice** (Jane Austen): IDs 37, 51 (2 copies)
- **Lord of the Rings** (J.R.R. Tolkien): IDs 38, 45, 52 (3 copies!)  
- **The Chronicles of Narnia** (C.S. Lewis): IDs 43, 50, 57 (3 copies!)
- And many more...

## Fixes Applied

### 1. ✅ Backend Query Fix (`backend/routes/books.js`)
Changed the `/api/books/trending` endpoint to use `GROUP BY title, author`:

```javascript
// NEW CODE - Groups duplicates by title+author
SELECT 
  MIN(b.id) as id,
  b.title,
  b.author,
  MAX(b.description) as description,
  ...
FROM books b
GROUP BY b.title, b.author
ORDER BY ...
```

This ensures the API **always returns unique books** even with duplicates in the database.

### 2. ✅ Frontend Deduplication (`frontend/js/books.js`)
Added Set-based deduplication as a safety net:

```javascript
const uniqueBooks = [];
const seenIds = new Set();

response.forEach(book => {
  const bookId = book.id || book.book_id;
  if (bookId && !seenIds.has(bookId)) {
    seenIds.add(bookId);
    uniqueBooks.push(book);
  }
});
```

## To Apply the Fix

### Restart Backend
The backend **must be restarted** to load the new code:

```powershell
# Stop any running backend
Get-Process -Name node | Stop-Process -Force

# Start fresh
cd backend
$Env:SKIP_DB_TEST='true'
npm start
```

### Refresh Frontend
Hard refresh your browser (Ctrl+Shift+R or Ctrl+F5) to clear cache.

## Permanent Fix (Recommended)

### Clean Up Database
Run the SQL script I created to remove duplicate books:

```powershell
# Location: database/remove_duplicate_books.sql
mysql -u root -p taletrail_db < database/remove_duplicate_books.sql
```

This will:
1. Keep the book with the **lowest ID** for each title+author
2. Delete all other duplicates
3. Preserve ratings, reviews, and relationships

### OR Manual Cleanup

```sql
-- 1. Backup first!
mysqldump -u root -p taletrail_db > backup.sql

-- 2. Find duplicates
SELECT title, author, COUNT(*) as count, GROUP_CONCAT(id) as ids
FROM books
GROUP BY title, author
HAVING count > 1;

-- 3. Delete duplicates (keeps lowest ID)
DELETE b1 FROM books b1
INNER JOIN books b2 
WHERE b1.id > b2.id 
AND b1.title = b2.title 
AND b1.author = b2.author;

-- 4. Verify no duplicates remain
SELECT title, author, COUNT(*) as count
FROM books
GROUP BY title, author
HAVING count > 1;
```

## Why This Happened
Likely causes:
- SQL import file ran multiple times
- Manual data entry duplicates
- Merge from multiple data sources

## Current Status
- ✅ Backend code updated with GROUP BY deduplication
- ✅ Frontend code has Set-based safety net
- ⏳ **Backend needs restart** to apply changes
- ⏳ Database still has physical duplicates (not critical, query handles it)

## Testing After Restart

```powershell
# Test the API directly
Invoke-RestMethod -Uri 'http://localhost:3000/api/books/trending?limit=15' -UseBasicParsing | 
  Group-Object title | 
  Where-Object {$_.Count -gt 1}
# Should return NOTHING (no duplicates)
```

Then refresh `frontend/index.html` - each book should appear only once!
