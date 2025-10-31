const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get user's saved/favorite books
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(`📖 Getting favorites for user ${req.user.userId}`);
    
    const [favorites] = await db.execute(
      `SELECT b.*, c.name as country_name, c.code as country_code 
       FROM user_favorites uf
       JOIN books b ON uf.book_id = b.id
       LEFT JOIN countries c ON b.country_id = c.id
       WHERE uf.user_id = ?
       ORDER BY uf.created_at DESC`,
      [req.user.userId]
    );
    
    console.log(`✅ Found ${favorites.length} favorites for user ${req.user.userId}`);
    res.json({ favorites });
  } catch (error) {
    console.error('❌ Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Add book to favorites
router.post('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log(`❤️ Adding book ${bookId} to favorites for user ${req.user.userId}`);
    
    await db.execute(
      'INSERT INTO user_favorites (user_id, book_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()',
      [req.user.userId, bookId]
    );
    
    console.log(`✅ Book ${bookId} added to favorites for user ${req.user.userId}`);
    res.json({ message: 'Book saved to favorites' });
  } catch (error) {
    console.error('❌ Add favorite error:', error);
    res.status(500).json({ error: 'Failed to save book' });
  }
});

// Remove book from favorites
router.delete('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    await db.execute(
      'DELETE FROM user_favorites WHERE user_id = ? AND book_id = ?',
      [req.user.userId, bookId]
    );
    res.json({ message: 'Book removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove book' });
  }
});

module.exports = router;
