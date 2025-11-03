require('dotenv').config();
const pool = require('./config/database');

async function checkData() {
  try {
    console.log('📊 Checking database data...\n');
    
    // Check books
    const [books] = await pool.query('SELECT COUNT(*) as count FROM books');
    console.log(`📚 Books: ${books[0].count}`);
    
    // Check users
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users: ${users[0].count}`);
    
    // Check ratings
    const [ratings] = await pool.query('SELECT COUNT(*) as count FROM ratings');
    console.log(`⭐ Ratings: ${ratings[0].count}`);
    
    // Check interactions
    const [interactions] = await pool.query('SELECT COUNT(*) as count FROM user_interactions');
    console.log(`🔄 Interactions: ${interactions[0].count}`);
    
    // Sample books
    if (books[0].count > 0) {
      console.log('\n📖 Sample Books:');
      const [sampleBooks] = await pool.query('SELECT id, title, author, average_rating FROM books LIMIT 5');
      sampleBooks.forEach(book => {
        console.log(`  - [${book.id}] ${book.title} by ${book.author} (${book.average_rating || 'N/A'}⭐)`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();
