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

module.exports = router;
