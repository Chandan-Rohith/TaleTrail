require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixUser19() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🔍 Checking User 19 in Railway...\n');
    
    // Get user 19's favorites
    const [favorites] = await connection.execute(
      'SELECT uf.book_id, b.title FROM user_favorites uf JOIN books b ON uf.book_id = b.id WHERE uf.user_id = 19'
    );
    
    console.log(`📚 User 19 has ${favorites.length} favorite(s):`);
    
    if (favorites.length === 0) {
      console.log('   No favorites found!');
      return;
    }
    
    for (const fav of favorites) {
      console.log(`\n  📖 ${fav.title} (ID: ${fav.book_id})`);
      
      // Check if it has genres
      const [genres] = await connection.execute(
        `SELECT bg.name
         FROM book_genre_relations bgr 
         JOIN book_genres bg ON bgr.genre_id = bg.id 
         WHERE bgr.book_id = ?`,
        [fav.book_id]
      );
      
      if (genres.length === 0) {
        console.log(`     ❌ NO GENRES!`);
        console.log(`     🔧 This book needs genres. Which book is it?`);
        
        // Check if it's in our list of books that should have genres
        const booksWithGenres = await connection.execute(
          'SELECT DISTINCT book_id FROM book_genre_relations'
        );
        console.log(`\n  📊 ${booksWithGenres[0].length} books in database have genres`);
        console.log(`  ⚠️ User 19 favorited a book WITHOUT genres!`);
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

fixUser19();
