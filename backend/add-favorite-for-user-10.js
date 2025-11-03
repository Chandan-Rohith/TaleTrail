require('dotenv').config();
const mysql = require('mysql2/promise');

async function addFavorite() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n❤️ Adding Pride and Prejudice (book 44) to user 10 favorites...\n');
    
    // Add favorite
    await connection.execute(
      'INSERT INTO user_favorites (user_id, book_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()',
      [10, 44]
    );
    
    console.log('✅ Favorite added successfully!');
    
    // Verify
    const [favorites] = await connection.execute(
      'SELECT uf.book_id, b.title FROM user_favorites uf JOIN books b ON uf.book_id = b.id WHERE uf.user_id = ?',
      [10]
    );
    
    console.log(`\n📚 User 10 now has ${favorites.length} favorite(s):`);
    favorites.forEach(fav => {
      console.log(`  - ${fav.title} (ID: ${fav.book_id})`);
    });
    
    // Check if book 44 has genres
    const [genres] = await connection.execute(
      `SELECT bg.genre_name 
       FROM book_genre_relations bgr 
       JOIN book_genres bg ON bgr.genre_id = bg.id 
       WHERE bgr.book_id = 44`
    );
    
    console.log(`\n🎭 Pride and Prejudice has ${genres.length} genres: ${genres.map(g => g.genre_name).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addFavorite();
