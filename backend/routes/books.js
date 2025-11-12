const express = require('express');
const db = require('../config/database');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get all books with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      country,
      author,
      search,
      sort = 'rating',
      order = 'desc',
      limit = 20,
      offset = 0
    } = req.query;

    let whereClause = '';
    let params = [];
    
    // Build WHERE clause
    const conditions = [];
    
    if (country) {
      conditions.push('c.code = ?');
      params.push(country.toUpperCase());
    }
    
    if (author) {
      conditions.push('b.author LIKE ?');
      params.push(`%${author}%`);
    }
    
    if (search) {
      conditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Build ORDER BY clause
    let orderClause = '';
    switch (sort) {
      case 'title':
        orderClause = `ORDER BY b.title ${order.toUpperCase()}`;
        break;
      case 'author':
        orderClause = `ORDER BY b.author ${order.toUpperCase()}`;
        break;
      case 'year':
        orderClause = `ORDER BY b.publication_year ${order.toUpperCase()}`;
        break;
      case 'rating':
      default:
        orderClause = `ORDER BY b.average_rating ${order.toUpperCase()}, b.rating_count DESC`;
        break;
    }

    // Add deduplication to prevent duplicate books from showing
    // Uses same strategy as trending endpoint - select canonical row per (title, author)
    // The deduplication happens in the main WHERE clause
    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ') + ' AND b.id IN (SELECT MIN(id) FROM books GROUP BY title, author)';
    } else {
      whereClause = 'WHERE b.id IN (SELECT MIN(id) FROM books GROUP BY title, author)';
    }

    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.publication_year,
        b.isbn,
        b.cover_image_url,
        b.average_rating,
        b.rating_count,
        c.name as country_name,
        c.code as country_code
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    const limitNum = Math.max(1, Math.min(parseInt(limit) || 20, 100)); // Clamp between 1-100
    const offsetNum = Math.max(0, parseInt(offset) || 0); // Minimum 0

    // Note: MySQL doesn't support prepared statement placeholders for LIMIT/OFFSET
    // We use validated integers directly in the query (safe after parseInt + clamping)
    const queryWithLimits = query.replace('LIMIT ? OFFSET ?', `LIMIT ${limitNum} OFFSET ${offsetNum}`);

    const [books] = await db.execute(queryWithLimits, params);

    // Get total count for pagination (deduplicated count)
    let countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT b.id
        FROM books b
        LEFT JOIN countries c ON b.country_id = c.id
        ${whereClause}
      ) as deduplicated_books
    `;
    
    // Use same params array for count query (limit/offset not in params, they're in query string)
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;

    res.json({
      books,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get trending books (most rated/highest rated recent books)
router.get('/trending', async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const limitNum = Math.max(1, Math.min(parseInt(limit) || 12, 100)); // Clamp between 1-100
    
    console.log('Fetching trending books with limit:', limitNum);
    
    // Deduplication via subquery - returns canonical row per (title, author)
    // See DUPLICATE_BOOKS_FIX_SUMMARY.md for background on database cleanup
    // Note: Using db.query() since MySQL doesn't support prepared statement placeholders for LIMIT
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.cover_image_url,
        b.average_rating,
        b.rating_count,
        c.name as country_name,
        c.code as country_code
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      WHERE b.rating_count > 0
        AND b.id IN (
          SELECT MIN(id) 
          FROM books 
          GROUP BY title, author
        )
      ORDER BY 
        (b.average_rating * b.rating_count) DESC,
        b.rating_count DESC
      LIMIT ${limitNum}
    `;
    
    const [books] = await db.query(query);

    console.log('Found trending books (deduplicated):', books.length);
    res.json(books);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending books' });
  }
});

// Get single book by ID with reviews
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get book details
    const [books] = await db.execute(`
      SELECT 
        b.*,
        c.name as country_name,
        c.code as country_code
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      WHERE b.id = ?
    `, [id]);

    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = books[0];

    // Get reviews for this book
    const [reviews] = await db.execute(`
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.created_at,
        u.username
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ? AND r.review_text IS NOT NULL
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);

    res.json({
      book,
      reviews,
      user_has_rated: req.user ? await checkUserRating(req.user.userId, id) : false
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

// Get books by country
router.get('/country/:countryCode', optionalAuth, async (req, res) => {
  try {
    const { countryCode } = req.params;
    const limit = req.query.limit || 10;

    const limitNum = Math.max(1, Math.min(parseInt(limit) || 10, 100)); // Validate: 1-100 range
    const countryCodeUpper = countryCode.toUpperCase().substring(0, 3); // Limit to 3 chars for country code
    
    // Add deduplication to prevent duplicate books from showing
    // Note: MySQL prepared statements don't support placeholders for LIMIT
    const booksQuery = `
      SELECT 
        b.*,
        c.name as country_name,
        c.code as country_code
      FROM books b
      JOIN countries c ON b.country_id = c.id
      WHERE c.code = ?
        AND b.id IN (SELECT MIN(id) FROM books GROUP BY title, author)
      ORDER BY b.average_rating DESC, b.rating_count DESC
      LIMIT ${limitNum}
    `;
    
    const [books] = await db.execute(booksQuery, [countryCodeUpper]);

    // Get country info
    const [countries] = await db.execute(`
      SELECT name, code FROM countries WHERE code = ?
    `, [countryCodeUpper]);

    const country = countries.length > 0 ? countries[0] : null;

    res.json({
      country,
      books,
      total: books.length
    });
  } catch (error) {
    console.error('Error fetching books by country:', error);
    res.status(500).json({ error: 'Failed to fetch books by country' });
  }
});

// Helper function to check if user has rated a book
async function checkUserRating(userId, bookId) {
  try {
    const [ratings] = await db.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND book_id = ?',
      [userId, bookId]
    );
    return ratings.length > 0;
  } catch {
    return false;
  }
}

module.exports = router;