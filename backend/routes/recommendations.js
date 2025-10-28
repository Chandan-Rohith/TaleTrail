const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Get personalized recommendations for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 10;

    // Call Python ML service
    const response = await axios.get(`${ML_SERVICE_URL}/recommendations/user/${userId}`, {
      params: { limit }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error getting user recommendations:', error.message);
    
    // Fallback to simple recommendations if ML service fails
    try {
      const [books] = await db.execute(`
        SELECT b.*, c.name as country_name 
        FROM books b
        LEFT JOIN countries c ON b.country_id = c.id
        ORDER BY b.average_rating DESC, b.rating_count DESC
        LIMIT ?
      `, [parseInt(req.query.limit) || 10]);

      res.json({
        user_id: parseInt(userId),
        recommendations: books.map(book => ({
          book_id: book.id,
          title: book.title,
          author: book.author,
          country: book.country_name,
          rating: book.average_rating,
          recommendation_type: 'fallback'
        })),
        total: books.length,
        fallback: true
      });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
});

// Get books similar to a specific book
router.get('/similar/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const limit = req.query.limit || 5;

    // Call Python ML service
    const response = await axios.get(`${ML_SERVICE_URL}/recommendations/similar/${bookId}`, {
      params: { limit }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error getting similar books:', error.message);
    
    // Fallback: get books from same country/author
    try {
      const [targetBook] = await db.execute('SELECT * FROM books WHERE id = ?', [bookId]);
      
      if (targetBook.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }

      const [similarBooks] = await db.execute(`
        SELECT b.*, c.name as country_name
        FROM books b
        LEFT JOIN countries c ON b.country_id = c.id
        WHERE (b.country_id = ? OR b.author = ?) AND b.id != ?
        ORDER BY b.average_rating DESC
        LIMIT ?
      `, [targetBook[0].country_id, targetBook[0].author, bookId, parseInt(limit)]);

      res.json({
        book_id: parseInt(bookId),
        similar_books: similarBooks.map(book => ({
          book_id: book.id,
          title: book.title,
          author: book.author,
          country: book.country_name,
          rating: book.average_rating
        })),
        total: similarBooks.length,
        fallback: true
      });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to get similar books' });
    }
  }
});

// Get trending books
router.get('/trending', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const days = req.query.days || 7;

    // Call Python ML service
    const response = await axios.get(`${ML_SERVICE_URL}/recommendations/trending`, {
      params: { limit, days }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error getting trending books:', error.message);
    
    // Fallback to highest rated books
    try {
      const [books] = await db.execute(`
        SELECT b.*, c.name as country_name
        FROM books b
        LEFT JOIN countries c ON b.country_id = c.id
        ORDER BY b.average_rating DESC, b.rating_count DESC
        LIMIT ?
      `, [parseInt(limit)]);

      res.json({
        trending_books: books.map(book => ({
          book_id: book.id,
          title: book.title,
          author: book.author,
          rating: book.average_rating,
          recommendation_type: 'fallback_trending'
        })),
        period_days: parseInt(days),
        total: books.length,
        fallback: true
      });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to get trending books' });
    }
  }
});

// Trigger model retraining
router.post('/train', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/train`);
    res.json(response.data);
  } catch (error) {
    console.error('Error training models:', error.message);
    res.status(500).json({ error: 'Failed to train models' });
  }
});

// Get genre-based personalized recommendations (NEW - no ML service dependency)
router.get('/personalized', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's favorite book genres (most common genres from saved books)
    const [favoriteGenres] = await db.execute(
      `SELECT DISTINCT bg.genre_name, COUNT(*) as genre_count
       FROM user_favorites uf
       JOIN book_genres bg ON uf.book_id = bg.book_id
       WHERE uf.user_id = ?
       GROUP BY bg.genre_name
       ORDER BY genre_count DESC
       LIMIT 5`,
      [userId]
    );

    if (favoriteGenres.length === 0) {
      // No favorites yet, return popular/highly-rated books
      const [popularBooks] = await db.execute(
        `SELECT b.*, c.name as country_name, c.code as country_code,
                AVG(r.rating) as average_rating, COUNT(r.id) as rating_count
         FROM books b
         LEFT JOIN countries c ON b.country_id = c.id
         LEFT JOIN ratings r ON b.id = r.book_id
         GROUP BY b.id
         ORDER BY average_rating DESC, rating_count DESC
         LIMIT 12`
      );
      return res.json({ books: popularBooks, message: 'Popular books (no favorites yet)' });
    }

    // Get books with matching genres (excluding already favorited)
    const genres = favoriteGenres.map(g => g.genre_name);
    const placeholders = genres.map(() => '?').join(',');
    
    const [recommendations] = await db.execute(
      `SELECT DISTINCT b.*, c.name as country_name, c.code as country_code,
              AVG(r.rating) as average_rating, COUNT(r.id) as rating_count
       FROM books b
       LEFT JOIN countries c ON b.country_id = c.id
       LEFT JOIN ratings r ON b.id = r.book_id
       JOIN book_genres bg ON b.id = bg.book_id
       WHERE bg.genre_name IN (${placeholders})
       AND b.id NOT IN (
         SELECT book_id FROM user_favorites WHERE user_id = ?
       )
       GROUP BY b.id
       ORDER BY average_rating DESC, rating_count DESC
       LIMIT 12`,
      [...genres, userId]
    );

    res.json({ 
      books: recommendations, 
      based_on_genres: genres,
      message: `Recommendations based on your favorite genres: ${genres.join(', ')}`
    });
  } catch (error) {
    console.error('Personalized recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;