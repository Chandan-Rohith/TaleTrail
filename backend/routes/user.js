const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Rate a book
router.post('/rate', authenticateToken, [
  body('bookId').isInt({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('reviewText').optional().isLength({ max: 1000 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, rating, reviewText } = req.body;
    const userId = req.user.userId;

    // Check if book exists
    const [books] = await db.execute('SELECT id FROM books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Insert or update rating
    await db.execute(`
      INSERT INTO ratings (user_id, book_id, rating, review_text, created_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        rating = VALUES(rating),
        review_text = VALUES(review_text),
        created_at = NOW()
    `, [userId, bookId, rating, reviewText || null]);

    // Update book's average rating
    await updateBookRating(bookId);

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get user's ratings
router.get('/ratings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    const [ratings] = await db.execute(`
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.created_at,
        b.title,
        b.author,
        b.cover_image_url,
        c.name as country_name
      FROM ratings r
      JOIN books b ON r.book_id = b.id
      LEFT JOIN countries c ON b.country_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), parseInt(offset)]);

    // Get total count
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM ratings WHERE user_id = ?',
      [userId]
    );

    res.json({
      ratings,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Get user profile stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get various stats
    const [ratingsCount] = await db.execute(
      'SELECT COUNT(*) as count FROM ratings WHERE user_id = ?',
      [userId]
    );

    const [avgRating] = await db.execute(
      'SELECT AVG(rating) as avg_rating FROM ratings WHERE user_id = ?',
      [userId]
    );

    const [countriesRead] = await db.execute(`
      SELECT COUNT(DISTINCT c.id) as count
      FROM user_favorites uf
      JOIN books b ON uf.book_id = b.id
      JOIN countries c ON b.country_id = c.id
      WHERE uf.user_id = ?
    `, [userId]);

    const [favoritesCount] = await db.execute(`
      SELECT COUNT(*) as count
      FROM user_favorites
      WHERE user_id = ?
    `, [userId]);

    res.json({
      books_rated: ratingsCount[0].count,
      average_rating_given: parseFloat(avgRating[0].avg_rating || 0).toFixed(1),
      countries_explored: countriesRead[0].count,
      favorite_books: favoritesCount[0].count
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Helper function to update book's average rating
async function updateBookRating(bookId) {
  try {
    const [result] = await db.execute(`
      SELECT 
        AVG(rating) as avg_rating,
        COUNT(*) as rating_count
      FROM ratings
      WHERE book_id = ?
    `, [bookId]);

    const avgRating = parseFloat(result[0].avg_rating || 0);
    const ratingCount = result[0].rating_count || 0;

    await db.execute(`
      UPDATE books 
      SET average_rating = ?, rating_count = ?
      WHERE id = ?
    `, [avgRating, ratingCount, bookId]);
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
}

module.exports = router;