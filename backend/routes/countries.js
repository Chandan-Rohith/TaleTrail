const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get all countries with book counts
router.get('/', async (req, res) => {
  try {
    const [countries] = await db.execute(`
      SELECT 
        c.id,
        c.name,
        c.code,
        c.coordinates,
        COUNT(b.id) as book_count,
        COALESCE(AVG(b.average_rating), 0) as avg_country_rating
      FROM countries c
      LEFT JOIN books b ON c.id = b.country_id
      GROUP BY c.id, c.name, c.code, c.coordinates
      HAVING book_count > 0
      ORDER BY book_count DESC, avg_country_rating DESC
    `);

    res.json({ countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Get single country with its top books
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const limit = req.query.limit || 5;

    // Get country info
    const [countries] = await db.execute(`
      SELECT * FROM countries WHERE code = ?
    `, [code.toUpperCase()]);

    if (countries.length === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const country = countries[0];

    // Get top books from this country
    const [books] = await db.execute(`
      SELECT 
        b.*,
        c.name as country_name
      FROM books b
      JOIN countries c ON b.country_id = c.id
      WHERE c.code = ?
      ORDER BY b.average_rating DESC, b.rating_count DESC
      LIMIT ?
    `, [code.toUpperCase(), parseInt(limit)]);

    res.json({
      country,
      books,
      total: books.length
    });
  } catch (error) {
    console.error('Error fetching country details:', error);
    res.status(500).json({ error: 'Failed to fetch country details' });
  }
});

module.exports = router;