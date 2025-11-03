/**
 * One-time script to fix missing genres in production database
 * Run this via: POST /api/admin/fix-book-genres
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

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

/**
 * DEBUG ENDPOINT - SECURITY WARNING
 * This endpoint exposes sensitive user information and should ONLY be enabled
 * in development environments with proper authentication.
 * 
 * PRODUCTION SAFEGUARDS:
 * - Requires DEBUG_ADMIN_ENDPOINT=true environment variable
 * - Requires authentication via authenticateToken middleware
 * - Requires admin role (if role system is implemented)
 * - Logs all access attempts for audit trail
 * - Redacts sensitive PII in responses
 */
router.post('/debug-token', authenticateToken, async (req, res) => {
    try {
        // Production safety check - disable in production unless explicitly enabled
        if (process.env.NODE_ENV === 'production' && process.env.DEBUG_ADMIN_ENDPOINT !== 'true') {
            console.warn('⚠️ Blocked debug-token access attempt in production', {
                requesterId: req.user?.id,
                timestamp: new Date().toISOString()
            });
            return res.status(403).json({ error: 'This endpoint is disabled in production' });
        }
        
        // Authorization check - verify admin access
        // Note: Update this check when role system is implemented
        if (req.user && req.user.role !== 'admin') {
            console.warn('⚠️ Unauthorized debug-token access attempt', {
                requesterId: req.user.id,
                timestamp: new Date().toISOString()
            });
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }
        
        // Validate JWT_SECRET is configured
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('❌ JWT_SECRET not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        const decoded = jwt.verify(token, jwtSecret);
        
        // Audit log - record all debug token inspections
        console.log('🔍 Admin debug-token inspection', {
            adminId: req.user?.id,
            investigatedUserId: decoded.userId,
            timestamp: new Date().toISOString(),
            ip: req.ip
        });
        
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
        
        // Return response with PII redacted unless in development
        const user = users[0];
        res.json({
            decoded,
            userExists: true,
            user: {
                id: user.id,
                username: user.username,
                email: process.env.NODE_ENV === 'development' ? user.email : '[REDACTED]'
            },
            favoritesCount: favs[0].count
        });
        
    } catch (error) {
        // Log full error server-side for debugging
        console.error('❌ Debug-token error:', {
            error: error.message,
            stack: error.stack,
            adminId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        
        // Return sanitized error to client
        res.status(400).json({ error: 'Invalid token' });
    }
});

module.exports = router;
