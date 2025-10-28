# TaleTrail Database Setup Guide

## Quick Setup (MySQL Workbench)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **File → Run SQL Script**
4. Select `database/schema.sql` from this project
5. Click **Run**
6. Verify tables created: users, books, countries, ratings, user_favorites, etc.

## Required Render Environment Variables

```
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
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
