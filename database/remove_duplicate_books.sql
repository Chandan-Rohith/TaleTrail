-- Remove Duplicate Books from Database
-- Keeps the book with the LOWEST ID for each title+author combination

-- First, let's see what duplicates we have
SELECT title, author, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as all_ids
FROM books
GROUP BY title, author
HAVING count > 1
ORDER BY count DESC, title;

-- Create a temporary table with the IDs we want to KEEP (lowest ID for each title+author)
CREATE TEMPORARY TABLE books_to_keep AS
SELECT MIN(id) as id
FROM books
GROUP BY title, author;

-- Show which books will be DELETED (for review)
SELECT b.id, b.title, b.author, b.average_rating, b.rating_count
FROM books b
WHERE b.id NOT IN (SELECT id FROM books_to_keep)
ORDER BY b.title, b.id;

-- IMPORTANT: Before running the DELETE, backup your data!
-- Run this command in your terminal:
-- mysqldump -u root -p taletrail_db > backup_before_dedup.sql

-- DELETE duplicate books (keeps only the one with lowest ID)
-- WARNING: This will permanently delete data!
-- Uncomment the line below when you're ready:

-- DELETE FROM books
-- WHERE id NOT IN (SELECT id FROM books_to_keep);

-- After deletion, check results:
-- SELECT title, author, COUNT(*) as count
-- FROM books
-- GROUP BY title, author
-- HAVING count > 1;

-- Clean up temporary table
DROP TEMPORARY TABLE IF EXISTS books_to_keep;

-- Optional: Reset auto-increment if there are gaps
-- ALTER TABLE books AUTO_INCREMENT = 1;
