# TaleTrail Database Setup Guide

## Quick Setup (MySQL Workbench)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. **IMPORTANT:** If you get "Table already exists" errors, the script now includes `DROP TABLE` statements to clean up first
4. Go to **File → Run SQL Script**
5. Select `database/schema.sql` from this project
6. Click **Run**
7. Verify tables created: users, books, countries, ratings, user_favorites, etc.

> **Note:** The schema will DROP and recreate all tables, so any existing data will be lost. Back up first if needed!

## Required Render Environment Variables

```
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_secure_password_here
DB_NAME=taletrail_db
JWT_SECRET=your_random_secret_key_min_32_chars
NODE_ENV=production
```

## Verify Database

```sql
USE taletrail_db;
SHOW TABLES;
-- Should show: users, books, countries, ratings, user_favorites, book_genres, etc.
```

## Insert Sample Data

After running schema.sql, run these files in order:
1. `database/sample_data.sql` - adds countries and sample books
2. Optionally: `database/add_books_corrected.sql`, `database/add_more_books.sql`
