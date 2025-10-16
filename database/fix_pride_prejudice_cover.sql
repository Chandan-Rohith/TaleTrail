-- Fix Pride and Prejudice cover image path
-- The image file exists as pride-prejudice.jpg but database has pride_prejudice.jpg

USE taletrail_db;

-- Update the correct image path
UPDATE books 
SET cover_image_url = 'images/covers/pride-prejudice.jpg' 
WHERE title = 'Pride and Prejudice';

-- Verify the update
SELECT title, cover_image_url FROM books WHERE title = 'Pride and Prejudice';