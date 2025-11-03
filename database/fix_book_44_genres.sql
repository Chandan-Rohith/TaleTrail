-- Fix: Assign genres to Pride and Prejudice (Book ID 44)
-- Pride and Prejudice should have: Romance, Classic Literature

-- First, check what genres exist
SELECT * FROM book_genres;

-- Assign appropriate genres to Pride and Prejudice
-- Assuming genre IDs (adjust based on your book_genres table):
-- 1 = Fiction
-- 6 = Classic
-- 8 = Romance (if exists)

-- Add genres to Pride and Prejudice
INSERT INTO book_genre_relations (book_id, genre_id) VALUES
(44, 1),  -- Fiction
(44, 6);  -- Classic

-- If Romance genre exists (check genre ID first):
-- INSERT INTO book_genre_relations (book_id, genre_id) VALUES (44, 8);

-- Verify
SELECT b.id, b.title, bg.name as genre
FROM books b
JOIN book_genre_relations bgr ON b.id = bgr.book_id
JOIN book_genres bg ON bgr.genre_id = bg.id
WHERE b.id = 44;
