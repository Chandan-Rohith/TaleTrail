/**
 * One-time script to fix missing genres in production database
 * Run this via: POST /api/admin/fix-book-genres
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/fix-book-genres', async (req, res) => {
    try {
        console.log('🔧 Fixing missing book genres...');
        
        // Add genres to Pride and Prejudice (Book 44)
        await db.execute(`
            INSERT IGNORE INTO book_genre_relations (book_id, genre_id) VALUES
            (44, 2),   -- Romance
            (44, 12),  -- Classic
            (44, 8),   -- Literary Fiction
            (44, 6)    -- Historical Fiction
        `);
        
        // Verify
        const [genres] = await db.execute(`
            SELECT bg.name
            FROM book_genre_relations bgr
            JOIN book_genres bg ON bgr.genre_id = bg.id
            WHERE bgr.book_id = 44
        `);
        
        res.json({
            success: true,
            message: 'Genres added to Pride and Prejudice',
            genres: genres.map(g => g.name)
        });
        
    } catch (error) {
        console.error('Error fixing genres:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin endpoint to assign genres to multiple popular books
router.post('/assign-all-genres', async (req, res) => {
    try {
        console.log('🎨 Admin: Assigning genres to popular books');
        
        const bookGenreMappings = [
            { title: 'Jane Eyre', genres: [6, 2, 12, 8] },
            { title: 'Wuthering Heights', genres: [2, 12, 8] },
            { title: 'Crime and Punishment', genres: [12, 8, 16] },
            { title: 'The Grapes of Wrath', genres: [6, 12, 8] },
            { title: 'To Kill a Mockingbird', genres: [12, 8, 6] },
            { title: '1984', genres: [14, 12] },
            { title: 'Animal Farm', genres: [12] },
            { title: 'The Great Gatsby', genres: [12, 8, 2] },
            { title: 'The Catcher in the Rye', genres: [12, 8] },
            { title: 'War and Peace', genres: [6, 12, 8, 2] },
            { title: 'Anna Karenina', genres: [12, 2, 8] },
            { title: 'The Brothers Karamazov', genres: [12, 8] },
        ];

        let booksUpdated = 0;
        let genresAdded = 0;
        const results = [];

        for (const mapping of bookGenreMappings) {
            const [books] = await db.execute(
                'SELECT id, title FROM books WHERE title LIKE ?',
                [`%${mapping.title}%`]
            );

            if (books.length === 0) {
                results.push({ book: mapping.title, status: 'not_found' });
                continue;
            }

            const book = books[0];
            const genres = [];

            for (const genreId of mapping.genres) {
                await db.execute(
                    'INSERT IGNORE INTO book_genre_relations (book_id, genre_id) VALUES (?, ?)',
                    [book.id, genreId]
                );
                
                const [genreInfo] = await db.execute(
                    'SELECT name FROM book_genres WHERE id = ?',
                    [genreId]
                );
                if (genreInfo.length > 0) {
                    genres.push(genreInfo[0].name);
                }
                genresAdded++;
            }

            booksUpdated++;
            results.push({
                book: book.title,
                id: book.id,
                status: 'updated',
                genres: genres
            });
        }

        res.json({
            success: true,
            message: `Updated ${booksUpdated} books with ${genresAdded} genre assignments`,
            booksUpdated,
            genresAdded,
            results
        });
    } catch (error) {
        console.error('Admin error:', error);
        res.status(500).json({ error: 'Failed to assign genres' });
    }
});

// Debug endpoint to check if a token belongs to which user
router.post('/debug-token', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }
        
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        
        // Get user info
        const [users] = await db.execute(
            'SELECT id, username, email FROM users WHERE id = ?',
            [decoded.userId]
        );
        
        if (users.length === 0) {
            return res.json({
                decoded,
                userExists: false,
                message: 'Token is valid but user does not exist in database'
            });
        }
        
        // Get favorites count
        const [favs] = await db.execute(
            'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?',
            [decoded.userId]
        );
        
        res.json({
            decoded,
            userExists: true,
            user: users[0],
            favoritesCount: favs[0].count
        });
        
    } catch (error) {
        res.status(400).json({ error: 'Invalid token', details: error.message });
    }
});

module.exports = router;
