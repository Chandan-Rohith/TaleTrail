-- Fix: Assign genres to Pride and Prejudice (Book ID 44)
-- Assign genres: Romance (ID 2), Classic (ID 12), Literary Fiction (ID 8), Historical Fiction (ID 6)

-- First, check what genres exist
SELECT * FROM book_genres;

-- Add genres to Pride and Prejudice
-- Using INSERT IGNORE for idempotency (safe to re-run)
INSERT IGNORE INTO book_genre_relations (book_id, genre_id) VALUES
(44, 2),   -- Romance
(44, 12),  -- Classic
(44, 8),   -- Literary Fiction
(44, 6);   -- Historical Fiction

-- If Romance genre exists (check genre ID first):
-- INSERT INTO book_genre_relations (book_id, genre_id) VALUES (44, 8);

-- Verify
SELECT b.id, b.title, bg.name as genre
FROM books b
JOIN book_genre_relations bgr ON b.id = bgr.book_id
JOIN book_genres bg ON bgr.genre_id = bg.id
WHERE b.id = 44;
