require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixUser17() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🔍 Checking User 17...\n');
    
    // Check if user 17 exists
    const [users] = await connection.execute(
      'SELECT id, username, email FROM users WHERE id = 17'
    );
    
    if (users.length === 0) {
      console.log('❌ User 17 does not exist in Railway database!');
      console.log('   User 17 might be in your local database only.');
      return;
    }
    
    console.log(`✅ User 17 exists: ${users[0].username} (${users[0].email})`);
    
    // Get favorites
    const [favorites] = await connection.execute(
      'SELECT uf.book_id, b.title FROM user_favorites uf JOIN books b ON uf.book_id = b.id WHERE uf.user_id = 17'
    );
    
    console.log(`\n📚 User 17 has ${favorites.length} favorite(s):`);
    
    if (favorites.length === 0) {
      console.log('   No favorites yet!');
      return;
    }
    
    for (const fav of favorites) {
      console.log(`\n  📖 ${fav.title} (ID: ${fav.book_id})`);
      
      // Check genres
      const [genres] = await connection.execute(
        `SELECT bg.name
         FROM book_genre_relations bgr 
         JOIN book_genres bg ON bgr.genre_id = bg.id 
         WHERE bgr.book_id = ?`,
        [fav.book_id]
      );
      
      if (genres.length === 0) {
        console.log(`     ❌ NO GENRES! This is why recommendations are empty.`);
        console.log(`     Need to add genres to book ${fav.book_id}`);
      } else {
        console.log(`     ✅ Has ${genres.length} genres: ${genres.map(g => g.name).join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

fixUser17();
