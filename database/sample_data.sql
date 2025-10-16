-- Sample data for TaleTrail - Colorful books from around the world
USE taletrail_db;

-- Insert countries with coordinates for map display
INSERT INTO countries (name, code, coordinates) VALUES
('United States', 'US', '{"lat": 39.8283, "lng": -98.5795}'),
('United Kingdom', 'GB', '{"lat": 55.3781, "lng": -3.4360}'),
('France', 'FR', '{"lat": 46.2276, "lng": 2.2137}'),
('Japan', 'JP', '{"lat": 36.2048, "lng": 138.2529}'),
('India', 'IN', '{"lat": 20.5937, "lng": 78.9629}'),
('Brazil', 'BR', '{"lat": -14.2350, "lng": -51.9253}'),
('Nigeria', 'NG', '{"lat": 9.0820, "lng": 8.6753}'),
('Russia', 'RU', '{"lat": 61.5240, "lng": 105.3188}'),
('China', 'CN', '{"lat": 35.8617, "lng": 104.1954}'),
('Mexico', 'MX', '{"lat": 23.6345, "lng": -102.5528}'),
('Egypt', 'EG', '{"lat": 26.0975, "lng": 30.0444}'),
('South Africa', 'ZA', '{"lat": -30.5595, "lng": 22.9375}'),
('Australia', 'AU', '{"lat": -25.2744, "lng": 133.7751}'),
('Argentina', 'AR', '{"lat": -38.4161, "lng": -63.6167}'),
('Colombia', 'CO', '{"lat": 4.5709, "lng": -74.2973}'),
('Turkey', 'TR', '{"lat": 38.9637, "lng": 35.2433}'),
('Kenya', 'KE', '{"lat": -0.0236, "lng": 37.9062}'),
('Thailand', 'TH', '{"lat": 15.8700, "lng": 100.9925}'),
('Italy', 'IT', '{"lat": 41.8719, "lng": 12.5674}'),
('Spain', 'ES', '{"lat": 40.4637, "lng": -3.7492}');

-- Insert book genres with colorful themes
INSERT INTO book_genres (name, color_hex) VALUES
('Fiction', '#8B1538'),           -- Burgundy
('Romance', '#E91E63'),           -- Pink
('Mystery', '#4A148C'),           -- Deep Purple
('Fantasy', '#2E7D32'),           -- Forest Green
('Science Fiction', '#1565C0'),   -- Blue
('Historical Fiction', '#BF360C'), -- Deep Orange
('Contemporary', '#F57C00'),      -- Orange
('Literary Fiction', '#5D4037'),  -- Brown
('Adventure', '#388E3C'),         -- Green
('Magical Realism', '#7B1FA2'),   -- Purple
('Young Adult', '#FF4081'),       -- Bright Pink
('Classic', '#8D6E63'),           -- Light Brown
('Biography', '#616161'),         -- Grey
('Poetry', '#AD1457'),            -- Magenta
('Drama', '#C62828'),             -- Red
('Thriller', '#1A237E'),          -- Dark Blue
('Horror', '#212121'),            -- Dark Grey
('Comedy', '#FF9800'),            -- Amber
('Philosophy', '#455A64'),        -- Blue Grey
('Travel', '#00ACC1');            -- Cyan

-- Insert sample books with rich descriptions
INSERT INTO books (title, author, description, publication_year, isbn, country_id, cover_image_url, average_rating, rating_count) VALUES
-- United States
('To Kill a Mockingbird', 'Harper Lee', 'A gripping, heart-wrenching tale of racial injustice and lost innocence in the American South. Through the eyes of Scout Finch, we witness the moral complexity of human nature in a story that continues to resonate with readers worldwide.', 1960, '9780061120084', 1, 'https://example.com/mockingbird.jpg', 4.3, 2847),

('The Great Gatsby', 'F. Scott Fitzgerald', 'A dazzling critique of the American Dream set in the jazz-soaked 1920s. Gatsby\'s tragic pursuit of love and status unfolds in a world of glittering parties and dark secrets, painted in Fitzgerald\'s luminous prose.', 1925, '9780743273565', 1, 'https://example.com/gatsby.jpg', 3.9, 1923),

('Beloved', 'Toni Morrison', 'A haunting masterpiece that confronts the brutal legacy of slavery through the story of Sethe and her daughter Denver. Morrison\'s lyrical prose weaves together memory, trauma, and redemption in unforgettable fashion.', 1987, '9781400033416', 1, 'https://example.com/beloved.jpg', 4.1, 1456),

-- United Kingdom
('Pride and Prejudice', 'Jane Austen', 'Witty, romantic, and endlessly quotable - Austen\'s masterpiece sparkles with social commentary and unforgettable characters. Elizabeth Bennet and Mr. Darcy\'s love story remains as captivating today as it was 200 years ago.', 1813, '9780141439518', 2, 'https://example.com/pride.jpg', 4.2, 3421),

('1984', 'George Orwell', 'A chilling prophecy of totalitarian control that feels frighteningly relevant today. Winston Smith\'s rebellion against Big Brother in a world of surveillance and thought-crime will leave you questioning the nature of truth and freedom.', 1949, '9780451524935', 2, 'https://example.com/1984.jpg', 4.0, 2876),

('Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 'Step into a world of magic, friendship, and wonder as Harry Potter discovers his destiny at Hogwarts School of Witchcraft and Wizardry. A beloved tale that ignited imagination in millions of readers across the globe.', 1997, '9780747532699', 2, 'https://example.com/harry-potter.jpg', 4.4, 4562),

-- France
('The Little Prince', 'Antoine de Saint-Exupéry', 'A philosophical fairy tale that speaks to the child in every adult. Through the eyes of a little prince from another planet, we discover profound truths about love, friendship, and what truly matters in life.', 1943, '9780156012195', 3, 'https://example.com/little-prince.jpg', 4.3, 2134),

('Les Misérables', 'Victor Hugo', 'An epic tale of redemption set against the tumultuous backdrop of 19th-century France. Jean Valjean\'s journey from convict to saint unfolds in Hugo\'s sweeping narrative of love, sacrifice, and social justice.', 1862, '9780451419439', 3, 'https://example.com/les-miserables.jpg', 4.2, 1876),

-- Japan
('Norwegian Wood', 'Haruki Murakami', 'A melancholic coming-of-age story set in 1960s Tokyo, painted in Murakami\'s signature dreamy prose. Toru Watanabe navigates love, loss, and the complexities of growing up in this beautiful and haunting novel.', 1987, '9780375704024', 4, 'https://example.com/norwegian-wood.jpg', 3.9, 1654),

('The Tale of Genji', 'Murasaki Shikibu', 'Often considered the world\'s first novel, this 11th-century masterpiece follows the romantic adventures of Prince Genji in the Japanese imperial court. A timeless exploration of love, beauty, and the fleeting nature of life.', 1010, '9780140437148', 4, 'https://example.com/genji.jpg', 3.8, 892),

-- India
('Midnight\'s Children', 'Salman Rushdie', 'A magical realist epic that mirrors the birth of modern India through the extraordinary life of Saleem Sinai. Born at the stroke of midnight on India\'s independence, Saleem\'s story weaves personal and political history into a dazzling tapestry.', 1981, '9780812976533', 5, 'https://example.com/midnights-children.jpg', 4.0, 1543),

('The God of Small Things', 'Arundhati Roy', 'A lush, sensuous novel about childhood, forbidden love, and the tragic consequences of breaking social taboos. Set in Kerala, Roy\'s debut novel won the Booker Prize for its beautiful and heartbreaking storytelling.', 1997, '9780812979657', 5, 'https://example.com/god-small-things.jpg', 3.8, 1287),

-- Brazil
('The Alchemist', 'Paulo Coelho', 'A inspiring fable about following your dreams and listening to your heart. Santiago\'s journey from Spain to Egypt in search of treasure becomes a spiritual quest that has touched millions of readers worldwide.', 1988, '9780061122415', 6, 'https://example.com/alchemist.jpg', 3.9, 3245),

('City of God', 'Paulo Lins', 'A raw, powerful portrayal of life in Rio de Janeiro\'s favelas, told with unflinching honesty and surprising beauty. This semi-autobiographical novel exposes the harsh realities of poverty and violence while celebrating human resilience.', 1997, '9780802139122', 6, 'https://example.com/city-of-god.jpg', 4.1, 967),

-- Nigeria
('Things Fall Apart', 'Chinua Achebe', 'A powerful exploration of colonialism\'s impact on traditional African society through the story of Okonkwo, a proud Igbo warrior. Achebe\'s masterpiece gives voice to African experience and challenges Western narratives about the continent.', 1958, '9780385474542', 7, 'https://example.com/things-fall-apart.jpg', 3.9, 2134),

('Half of a Yellow Sun', 'Chimamanda Ngozi Adichie', 'Set during the Nigerian Civil War, this emotionally devastating novel follows three characters whose lives are forever changed by conflict. Adichie\'s masterful storytelling illuminates a dark chapter in African history.', 2006, '9781400044160', 7, 'https://example.com/half-yellow-sun.jpg', 4.3, 1543),

-- Russia
('War and Peace', 'Leo Tolstoy', 'An epic masterpiece that follows Russian society during the Napoleonic Wars. Through the intertwined lives of aristocratic families, Tolstoy creates a vast panorama of human experience, exploring themes of love, war, and destiny.', 1869, '9780199232765', 8, 'https://example.com/war-and-peace.jpg', 4.1, 1876),

('Crime and Punishment', 'Fyodor Dostoevsky', 'A psychological thriller that delves deep into the mind of Raskolnikov, a poor student who commits murder and must confront the consequences. A profound exploration of guilt, redemption, and the human soul.', 1866, '9780486415871', 8, 'https://example.com/crime-punishment.jpg', 4.2, 2098),

-- China
('Dream of the Red Chamber', 'Cao Xueqin', 'One of China\'s Four Great Classical Novels, this epic follows the rise and decline of the wealthy Jia family. A masterwork of Chinese literature that combines romance, philosophy, and social commentary.', 1791, '9780140442939', 9, 'https://example.com/red-chamber.jpg', 4.0, 743),

('Wild Swans', 'Jung Chang', 'Three generations of women in 20th-century China, from the last emperor to Mao\'s Cultural Revolution. Chang\'s family memoir reads like an epic novel, offering intimate insights into China\'s tumultuous modern history.', 1991, '9780743246989', 9, 'https://example.com/wild-swans.jpg', 4.3, 1654),

-- Mexico
('Like Water for Chocolate', 'Laura Esquivel', 'A magical realist tale of love, food, and family set during the Mexican Revolution. Tita\'s emotions infuse her cooking with supernatural powers in this sensuous celebration of Mexican culture and cuisine.', 1989, '9780385420174', 10, 'https://example.com/like-water-chocolate.jpg', 3.8, 1432),

('The Labyrinth of Solitude', 'Octavio Paz', 'A profound meditation on Mexican identity, culture, and history by the Nobel Prize-winning poet. Paz explores what it means to be Mexican in this influential work of cultural criticism and philosophy.', 1950, '9780802150424', 10, 'https://example.com/labyrinth-solitude.jpg', 4.1, 892);

-- Insert some sample users (passwords are hashed for 'password123')
INSERT INTO users (username, email, password_hash) VALUES
('bookworm_alice', 'alice@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm'),
('literature_lover', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm'),
('global_reader', 'maria@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm'),
('adventure_seeker', 'david@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm'),
('story_explorer', 'sarah@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm');

-- Assign genres to books
INSERT INTO book_genre_relations (book_id, genre_id) VALUES
-- Fiction books
(1, 1), (1, 6), -- To Kill a Mockingbird: Fiction, Historical Fiction
(2, 1), (2, 8), -- The Great Gatsby: Fiction, Literary Fiction
(3, 1), (3, 6), -- Beloved: Fiction, Historical Fiction
(4, 1), (4, 2), -- Pride and Prejudice: Fiction, Romance
(5, 1), (5, 5), -- 1984: Fiction, Science Fiction
(6, 4), (6, 11), -- Harry Potter: Fantasy, Young Adult
(7, 1), (7, 19), -- The Little Prince: Fiction, Philosophy
(8, 1), (8, 6), -- Les Misérables: Fiction, Historical Fiction
(9, 1), (9, 7), -- Norwegian Wood: Fiction, Contemporary
(10, 1), (10, 12), -- The Tale of Genji: Fiction, Classic
(11, 1), (11, 10), -- Midnight's Children: Fiction, Magical Realism
(12, 1), (12, 7), -- The God of Small Things: Fiction, Contemporary
(13, 1), (13, 9), -- The Alchemist: Fiction, Adventure
(14, 1), (14, 7), -- City of God: Fiction, Contemporary
(15, 1), (15, 6), -- Things Fall Apart: Fiction, Historical Fiction
(16, 1), (16, 6), -- Half of a Yellow Sun: Fiction, Historical Fiction
(17, 1), (17, 6), -- War and Peace: Fiction, Historical Fiction
(18, 1), (18, 3), -- Crime and Punishment: Fiction, Mystery
(19, 1), (19, 12), -- Dream of the Red Chamber: Fiction, Classic
(20, 13), (20, 6), -- Wild Swans: Biography, Historical Fiction
(21, 1), (21, 10), -- Like Water for Chocolate: Fiction, Magical Realism
(22, 19), (22, 13); -- The Labyrinth of Solitude: Philosophy, Biography

-- Insert sample ratings and reviews
INSERT INTO ratings (user_id, book_id, rating, review_text) VALUES
(1, 1, 5, 'An absolute masterpiece! Harper Lee created characters that feel like real people, and the story tackles difficult themes with grace and wisdom. A must-read for everyone.'),
(1, 6, 5, 'Magical! J.K. Rowling created a world so vivid and enchanting that I never wanted to leave Hogwarts. The perfect blend of adventure, friendship, and wonder.'),
(2, 2, 4, 'Fitzgerald\'s prose is absolutely beautiful, like poetry. The story is tragic but compelling, and it really captures the excess and emptiness of the Jazz Age.'),
(2, 4, 5, 'Jane Austen\'s wit is unmatched! Elizabeth Bennet is such a strong, intelligent heroine. The romance with Darcy is perfectly developed - slow burn at its finest.'),
(3, 11, 4, 'Rushdie\'s magical realism is incredible. The way he weaves Indian history with Saleem\'s personal story is masterful. Dense but rewarding.'),
(3, 7, 5, 'This book touched my heart in ways I didn\'t expect. So simple yet so profound. The little prince\'s observations about adults are both funny and deeply true.'),
(4, 13, 3, 'Beautiful message about following your dreams, though the writing felt a bit preachy at times. Still, it\'s an inspiring read that stays with you.'),
(4, 15, 4, 'Achebe gives such an important perspective on colonialism. Okonkwo is a complex character - flawed but human. The ending is heartbreaking.'),
(5, 5, 5, 'Terrifyingly relevant today! Orwell\'s vision of surveillance and thought control feels prophetic. Big Brother is watching, and it\'s scarier than ever.'),
(5, 21, 4, 'What a unique way to tell a story! The recipes and magical elements blend perfectly. Made me want to cook and fall in love at the same time.');

-- Insert user interactions for ML training
INSERT INTO user_interactions (user_id, book_id, interaction_type) VALUES
-- User 1 likes classic literature
(1, 1, 'view'), (1, 1, 'rating'), (1, 1, 'favorite'),
(1, 4, 'view'), (1, 4, 'rating'),
(1, 6, 'view'), (1, 6, 'rating'), (1, 6, 'favorite'),
(1, 8, 'view'),
(1, 10, 'view'),

-- User 2 enjoys American literature
(2, 2, 'view'), (2, 2, 'rating'), (2, 2, 'favorite'),
(2, 3, 'view'),
(2, 4, 'view'), (2, 4, 'rating'),
(2, 17, 'view'),

-- User 3 loves international fiction
(3, 11, 'view'), (3, 11, 'rating'),
(3, 7, 'view'), (3, 7, 'rating'), (3, 7, 'favorite'),
(3, 9, 'view'),
(3, 12, 'view'),
(3, 21, 'view'),

-- User 4 interested in social themes
(4, 13, 'view'), (4, 13, 'rating'),
(4, 15, 'view'), (4, 15, 'rating'),
(4, 16, 'view'),
(4, 14, 'view'),

-- User 5 enjoys dystopian/political fiction
(5, 5, 'view'), (5, 5, 'rating'), (5, 5, 'favorite'),
(5, 1, 'view'),
(5, 21, 'view'), (5, 21, 'rating'),
(5, 22, 'view');

-- Add some user favorites
INSERT INTO user_favorites (user_id, book_id) VALUES
(1, 1), (1, 6),
(2, 2),
(3, 7),
(5, 5);