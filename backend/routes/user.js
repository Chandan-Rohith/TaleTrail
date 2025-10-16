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

    // Log interaction
    await db.execute(`
      INSERT INTO user_interactions (user_id, book_id, interaction_type, created_at)
      VALUES (?, ?, 'rating', NOW())
      ON DUPLICATE KEY UPDATE created_at = NOW()
    `, [userId, bookId]);

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

// Get user's reading history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    const [history] = await db.execute(`
      SELECT DISTINCT
        ui.book_id,
        ui.interaction_type,
        ui.created_at,
        b.title,
        b.author,
        b.cover_image_url,
        b.average_rating,
        c.name as country_name,
        r.rating as user_rating
      FROM user_interactions ui
      JOIN books b ON ui.book_id = b.id
      LEFT JOIN countries c ON b.country_id = c.id
      LEFT JOIN ratings r ON (r.user_id = ui.user_id AND r.book_id = ui.book_id)
      WHERE ui.user_id = ?
      ORDER BY ui.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), parseInt(offset)]);

    res.json({
      history,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch reading history' });
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
      FROM user_interactions ui
      JOIN books b ON ui.book_id = b.id
      JOIN countries c ON b.country_id = c.id
      WHERE ui.user_id = ?
    `, [userId]);

    const [favoriteGenres] = await db.execute(`
      SELECT interaction_type, COUNT(*) as count
      FROM user_interactions
      WHERE user_id = ?
      GROUP BY interaction_type
      ORDER BY count DESC
    `, [userId]);

    res.json({
      books_rated: ratingsCount[0].count,
      average_rating_given: parseFloat(avgRating[0].avg_rating || 0).toFixed(1),
      countries_explored: countriesRead[0].count,
      favorite_interaction: favoriteGenres[0]?.interaction_type || 'none'
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