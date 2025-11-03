const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Try to use ML service if available, otherwise use SQL-based recommendations
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || null;
let axios;
if (ML_SERVICE_URL) {
  axios = require('axios');
}

// Helper function to check if ML service is available
async function checkMLService() {
  if (!ML_SERVICE_URL || !axios) {
    return false;
  }
  try {
    await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 2000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Get personalized recommendations for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID',
        recommendations: [],
        total: 0
      });
    }

    let books = [];
    let recommendationType = 'popular';

    // PRIORITY 1: Try ML Service for personalized recommendations (if configured)
    if (ML_SERVICE_URL && axios) {
      try {
        console.log(`🤖 Attempting ML recommendations for user ${userId}`);
        const mlResponse = await axios.get(`${ML_SERVICE_URL}/recommendations/user/${userId}`, {
          params: { 
            limit,
            content_weight: 0.7,  // Increased for genre emphasis
            collab_weight: 0.3
          },
          timeout: 5000
        });

        if (mlResponse.data && mlResponse.data.recommendations && mlResponse.data.recommendations.length > 0) {
          console.log(`✅ ML Service returned ${mlResponse.data.recommendations.length} recommendations`);
          
          // Get full book details from database for each recommendation
          const bookIds = mlResponse.data.recommendations.map(r => r.book_id);
          const placeholders = bookIds.map(() => '?').join(',');
          
          const [fullBooks] = await db.execute(`
            SELECT b.*, c.name as country_name 
            FROM books b
            LEFT JOIN countries c ON b.country_id = c.id
            WHERE b.id IN (${placeholders})
          `, bookIds);
          
          books = fullBooks;
          recommendationType = 'ml_personalized';
        }
      } catch (mlError) {
        console.log('ML Service unavailable, using SQL-based fallback:', mlError.message);
      }
    }

    // PRIORITY 2: SQL-based genre recommendations (built-in, no external service needed)
    if (books.length === 0) {
      try {
        // Get user's favorite books to find similar ones by genres
        console.log(`🔍 Checking favorites for user ${userId}`);
        const [userFavs] = await db.execute(`
          SELECT book_id FROM user_favorites WHERE user_id = ?
        `, [userId]);
        
        console.log(`📚 Found ${userFavs ? userFavs.length : 0} favorites for user ${userId}`);
        
        if (userFavs && userFavs.length > 0) {
          const favIds = userFavs.map(f => f.book_id);
          console.log(`📖 Favorite book IDs: ${favIds.join(', ')}`);
          
          // STEP 1: Try genre-based recommendations first (content-based filtering!)
          const placeholders1 = favIds.map(() => '?').join(',');
          const [genreBooks] = await db.execute(`
            SELECT b.id, b.title, b.author, b.description, b.cover_image_url, 
                   b.average_rating, b.rating_count, b.publication_year,
                   c.name as country_name, c.id as country_id,
                   COUNT(DISTINCT bgr2.genre_id) as matching_genres
            FROM books b
            LEFT JOIN countries c ON b.country_id = c.id
            LEFT JOIN book_genre_relations bgr2 ON b.id = bgr2.book_id
            WHERE bgr2.genre_id IN (
              SELECT DISTINCT genre_id 
              FROM book_genre_relations 
              WHERE book_id IN (${placeholders1})
            )
            AND b.id NOT IN (${placeholders1})
            GROUP BY b.id, b.title, b.author, b.description, b.cover_image_url,
                     b.average_rating, b.rating_count, b.publication_year,
                     c.name, c.id
            ORDER BY matching_genres DESC, b.average_rating DESC, b.rating_count DESC
            LIMIT ?
          `, [...favIds, ...favIds, limit]);
          
          console.log(`🎨 Found ${genreBooks ? genreBooks.length : 0} books with matching genres`);
          
          if (genreBooks && genreBooks.length > 0) {
            books = genreBooks;
            recommendationType = 'genre_based';
            console.log(`✅ Returning ${books.length} genre-based recommendations`);
          } else {
            // STEP 2: Fallback to country/author similarity
            const placeholders2 = favIds.map(() => '?').join(',');
            const [similarBooks] = await db.execute(`
              SELECT DISTINCT b.*, c.name as country_name
              FROM books b
              LEFT JOIN countries c ON b.country_id = c.id
              WHERE (b.country_id IN (
                SELECT DISTINCT country_id FROM books WHERE id IN (${placeholders2})
              ) OR b.author IN (
                SELECT DISTINCT author FROM books WHERE id IN (${placeholders2})
              ))
              AND b.id NOT IN (${placeholders2})
              ORDER BY b.average_rating DESC, b.rating_count DESC
              LIMIT ?
            `, [...favIds, ...favIds, ...favIds, limit]);
            
            console.log(`🎯 Found ${similarBooks ? similarBooks.length : 0} books by country/author`);
            
            if (similarBooks && similarBooks.length > 0) {
              books = similarBooks;
              recommendationType = 'similar_to_favorites';
              console.log(`✅ Returning ${books.length} books similar to user favorites`);
            } else {
              console.log('⚠️ No similar books found, will try popular fallback');
            }
          }
        } else {
          console.log('⚠️ User has no favorites yet');
        }
      } catch (favError) {
        console.error('❌ Favorite-based recommendations failed:', favError.message);
        console.error('Stack:', favError.stack);
      }
    }

    // PRIORITY 3: Fallback to popular books (excluding user's favorites)
    if (books.length === 0) {
      try {
        const [userFavs] = await db.execute(`
          SELECT book_id FROM user_favorites WHERE user_id = ?
        `, [userId]);
        
        const favIds = userFavs && userFavs.length > 0 ? userFavs.map(f => f.book_id) : [];
        
        if (favIds.length > 0) {
          const placeholders = favIds.map(() => '?').join(',');
          const [popularBooks] = await db.execute(`
            SELECT b.*, c.name as country_name 
            FROM books b
            LEFT JOIN countries c ON b.country_id = c.id
            WHERE b.id NOT IN (${placeholders})
            ORDER BY b.average_rating DESC, b.rating_count DESC
            LIMIT ?
          `, [...favIds, limit]);
          
          books = popularBooks || [];
        } else {
          const [popularBooks] = await db.execute(`
            SELECT b.*, c.name as country_name 
            FROM books b
            LEFT JOIN countries c ON b.country_id = c.id
            ORDER BY b.average_rating DESC, b.rating_count DESC
            LIMIT ?
          `, [limit]);
          
          books = popularBooks || [];
        }
      } catch (fallbackError) {
        console.error('Fallback recommendations error:', fallbackError.message);
      }
    }

    // Ensure we have valid data before sending response
    const validBooks = books.filter(book => book && book.id && book.title);

    res.json({
      user_id: parseInt(userId),
      recommendations: validBooks.map(book => ({
        book_id: book.id,
        id: book.id,
        title: book.title,
        author: book.author || 'Unknown Author',
        country: book.country_name || 'Unknown',
        country_name: book.country_name,
        rating: book.average_rating || 0,
        average_rating: book.average_rating || 0,
        description: book.description,
        cover_image_url: book.cover_image_url,
        recommendation_type: recommendationType
      })),
      total: validBooks.length
    });
  } catch (error) {
    console.error('Error getting user recommendations:', error.message);
    console.error('Stack:', error.stack);
    
    // Return empty recommendations instead of 500 error
    res.status(200).json({ 
      user_id: parseInt(req.params.userId),
      recommendations: [],
      total: 0,
      error: 'Failed to get personalized recommendations',
      fallback: true
    });
  }
});

// Get books similar to a specific book
router.get('/similar/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    console.log(`🔍 Getting similar books for book ${bookId}`);

    // Call Python ML service
    const response = await axios.get(`${ML_SERVICE_URL}/recommendations/similar/${bookId}`, {
      params: { limit },
      timeout: 5000
    });

    console.log(`✅ ML Service returned ${response.data.similar_books?.length || 0} similar books`);
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
    const limit = parseInt(req.query.limit) || 10;
    const days = parseInt(req.query.days) || 7;

    console.log(`📈 Getting trending books (${days} days, limit ${limit})`);

    // Call Python ML service
    const response = await axios.get(`${ML_SERVICE_URL}/recommendations/trending`, {
      params: { limit, days },
      timeout: 5000
    });

    console.log(`✅ ML Service returned ${response.data.trending_books?.length || 0} trending books`);
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

// Get genre-based recommendations from ML service (NEW)
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    console.log(`🎭 Getting recommendations for genre: ${genre}`);

    // Call Python ML service
    const response = await axios.get(`${ML_SERVICE_URL}/recommendations/genre/${genre}`, {
      params: { limit },
      timeout: 5000
    });

    console.log(`✅ ML Service returned ${response.data.top_books?.length || 0} books for genre ${genre}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting genre recommendations:', error.message);
    
    // Fallback to database query
    try {
      const [books] = await db.execute(`
        SELECT b.*, c.name as country_name
        FROM books b
        LEFT JOIN countries c ON b.country_id = c.id
        LEFT JOIN book_genres bg ON b.id = bg.book_id
        WHERE bg.genre_name LIKE ?
        ORDER BY b.average_rating DESC
        LIMIT ?
      `, [`%${req.params.genre}%`, limit]);

      res.json({
        genre: req.params.genre,
        top_books: books.map(book => ({
          book_id: book.id,
          title: book.title,
          author: book.author,
          rating: book.average_rating
        })),
        total: books.length,
        fallback: true
      });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to get genre recommendations' });
    }
  }
});

// Trigger model retraining
router.post('/train', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Triggering ML model retraining...');
    const response = await axios.post(`${ML_SERVICE_URL}/train`, {}, {
      timeout: 30000 // 30 seconds for training
    });
    console.log('✅ Models retrained successfully');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error training models:', error.message);
    res.status(500).json({ error: 'Failed to train models', details: error.message });
  }
});

// Health check for ML service
router.get('/ml-status', async (req, res) => {
  try {
    const isAvailable = await checkMLService();
    res.json({ 
      ml_service: isAvailable ? 'online' : 'offline',
      url: ML_SERVICE_URL,
      status: isAvailable ? 200 : 503
    });
  } catch (error) {
    res.json({ 
      ml_service: 'offline',
      url: ML_SERVICE_URL,
      status: 503,
      error: error.message
    });
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