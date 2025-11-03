# 📚 TaleTrail Database Setup Guide

## Quick Start - Choose Your Method

### Method 1: MySQL Workbench (Recommended for Beginners) ⭐

1. **Open MySQL Workbench**
2. **Connect to your database** (taletrail_db)
3. **Run SQL files in this order:**

#### Step 1: Run sample_data.sql
- Go to **File → Run SQL Script**
- Navigate to: `database/sample_data.sql`
- Click **Run**
- ✅ Adds 22 initial books + countries + genres

#### Step 2: Run add_more_books.sql
- Go to **File → Run SQL Script**
- Navigate to: `database/add_more_books.sql`
- Click **Run**
- ✅ Adds 60+ more books (10 books per country)

#### Step 3: (Optional) Run add_books_corrected.sql
- Go to **File → Run SQL Script**
- Navigate to: `database/add_books_corrected.sql`
- Click **Run**
- ✅ Adds even more books if you want a larger database

---

### Method 2: Command Line (Batch Script) 🚀

**For Windows Command Prompt:**

```cmd
cd database
run_sql_files.bat
```

The script will:
- Prompt for your MySQL password
- Run all 3 SQL files in order
- Show success/error messages

---

### Method 3: PowerShell Script 💻

**For PowerShell:**

```powershell
cd database
.\run_sql_files.ps1
```

---

### Method 4: Manual MySQL Command Line

**Open Command Prompt and run:**

```cmd
cd database

mysql -u root -p taletrail_db < sample_data.sql
mysql -u root -p taletrail_db < add_more_books.sql
mysql -u root -p taletrail_db < add_books_corrected.sql
```

---

## Verify Your Data 🔍

After running the SQL files, verify that books were added:

```cmd
cd backend
node check-data.js
```

### Expected Output:

```
📊 Checking database data...

📚 Books: 82+
👥 Users: 5
⭐ Ratings: 10
🔄 Interactions: 25

📖 Sample Books:
  - [1] To Kill a Mockingbird by Harper Lee (4.3⭐)
  - [2] The Great Gatsby by F. Scott Fitzgerald (3.9⭐)
  - [3] Beloved by Toni Morrison (4.1⭐)
  - [4] Pride and Prejudice by Jane Austen (4.2⭐)
  - [5] 1984 by George Orwell (4⭐)
```

---

## What Each SQL File Does

### 1. sample_data.sql (REQUIRED)
- ✅ 20 countries with coordinates
- ✅ 20 book genres with colors
- ✅ 22 diverse books from around the world
- ✅ 5 sample users
- ✅ 10 ratings and reviews
- ✅ User interactions for ML training
- ✅ User favorites

### 2. add_more_books.sql (RECOMMENDED)
- ✅ Adds 60+ more books
- ✅ 10 books per major country
- ✅ Includes classics and popular titles
- ✅ Diverse genres and authors

### 3. add_books_corrected.sql (OPTIONAL)
- ✅ Additional books for variety
- ✅ Fixed country IDs
- ✅ More diverse selection

---

## Troubleshooting 🔧

### Problem: "Access denied for user 'root'"
**Solution:** Check your MySQL password

### Problem: "Unknown database 'taletrail_db'"
**Solution:** Run the schema first:
```cmd
mysql -u root -p < schema.sql
```

### Problem: "Duplicate entry" errors
**Solution:** Your database already has data. Either:
1. Clear the database first
2. Skip files that cause duplicates

### Problem: Books count is still 0
**Solution:** 
1. Check if SQL files ran successfully
2. Verify you're connected to the correct database
3. Run `SELECT COUNT(*) FROM books;` in MySQL Workbench

---

## Database Structure

After setup, you'll have:

- **Countries:** 20 countries with map coordinates
- **Genres:** 20 book genres with color themes
- **Books:** 80+ books from around the world
- **Users:** 5 sample users (password: 'password123')
- **Ratings:** Sample ratings and reviews
- **Interactions:** User interaction data for ML recommendations

---

## Next Steps 🎯

1. ✅ Run SQL files
2. ✅ Verify data with `node check-data.js`
3. 🚀 Start your backend: `cd backend && npm start`
4. 🌐 Start your frontend: `cd frontend && npm start`
5. 🎉 Your ML recommendations will now work!

---

## Need Help?

- Check MySQL Workbench logs for errors
- Verify MySQL service is running
- Ensure you're using the correct database name: `taletrail_db`
- Check file paths are correct

---

**Happy Reading! 📚✨**
