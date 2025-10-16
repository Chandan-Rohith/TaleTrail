-- Update book covers with local image paths
-- Run this in MySQL Workbench after downloading images

USE taletrail_db;

UPDATE books SET cover_image_url = 'images/covers/harry-potter.jpg' WHERE title = 'Harry Potter and the Philosopher\'s Stone';
UPDATE books SET cover_image_url = 'images/covers/pride-prejudice.jpg' WHERE title = 'Pride and Prejudice';
UPDATE books SET cover_image_url = 'images/covers/alchemist.jpg' WHERE title = 'The Alchemist';
UPDATE books SET cover_image_url = 'images/covers/mockingbird.jpg' WHERE title = 'To Kill a Mockingbird';
UPDATE books SET cover_image_url = 'images/covers/1984.jpg' WHERE title = '1984';
UPDATE books SET cover_image_url = 'images/covers/little-prince.jpg' WHERE title = 'The Little Prince';
UPDATE books SET cover_image_url = 'images/covers/crime-punishment.jpg' WHERE title = 'Crime and Punishment';
UPDATE books SET cover_image_url = 'images/covers/things-fall-apart.jpg' WHERE title = 'Things Fall Apart';
UPDATE books SET cover_image_url = 'images/covers/les-miserables.jpg' WHERE title = 'Les Misérables';
UPDATE books SET cover_image_url = 'images/covers/war-peace.jpg' WHERE title = 'War and Peace';
UPDATE books SET cover_image_url = 'images/covers/great-gatsby.jpg' WHERE title = 'The Great Gatsby';
UPDATE books SET cover_image_url = 'images/covers/wild-swans.jpg' WHERE title = 'Wild Swans';
UPDATE books SET cover_image_url = 'images/covers/half-yellow-sun.jpg' WHERE title = 'Half of a Yellow Sun';
UPDATE books SET cover_image_url = 'images/covers/one-hundred-years.jpg' WHERE title = 'One Hundred Years of Solitude';
UPDATE books SET cover_image_url = 'images/covers/beloved.jpg' WHERE title = 'Beloved';
UPDATE books SET cover_image_url = 'images/covers/norwegian-wood.jpg' WHERE title = 'Norwegian Wood';
UPDATE books SET cover_image_url = 'images/covers/kite-runner.jpg' WHERE title = 'The Kite Runner';
UPDATE books SET cover_image_url = 'images/covers/persepolis.jpg' WHERE title = 'Persepolis';
UPDATE books SET cover_image_url = 'images/covers/god-small-things.jpg' WHERE title = 'The God of Small Things';
UPDATE books SET cover_image_url = 'images/covers/white-teeth.jpg' WHERE title = 'White Teeth';
UPDATE books SET cover_image_url = 'images/covers/metamorphosis.jpg' WHERE title = 'The Metamorphosis';

-- Additional books for recommendations
UPDATE books SET cover_image_url = 'images/covers/midnight-children.jpg' WHERE title = 'Midnight\'s Children';
UPDATE books SET cover_image_url = 'images/covers/like-water-chocolate.jpg' WHERE title = 'Like Water for Chocolate';

-- Books found with placeholder URLs
UPDATE books SET cover_image_url = 'images/covers/tale-of-genji.jpg' WHERE title = 'The Tale of Genji';
UPDATE books SET cover_image_url = 'images/covers/city-of-god.jpg' WHERE title = 'City of God';
UPDATE books SET cover_image_url = 'images/covers/dream-red-chamber.jpg' WHERE title = 'Dream of the Red Chamber';
UPDATE books SET cover_image_url = 'images/covers/labyrinth-solitude.jpg' WHERE title = 'The Labyrinth of Solitude';

-- Verify the updates
SELECT title, cover_image_url FROM books WHERE cover_image_url LIKE 'images/covers/%';