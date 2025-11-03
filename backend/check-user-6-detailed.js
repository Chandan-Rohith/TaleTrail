require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUser6() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🔍 Checking User 6 (Chandan Rohith) Favorites...\n');
    
    // Get user's favorites
    const [favorites] = await connection.execute(
      'SELECT uf.book_id, b.title FROM user_favorites uf JOIN books b ON uf.book_id = b.id WHERE uf.user_id = 6'
    );
    
    console.log(`📚 User 6 has ${favorites.length} favorite(s):`);
    
    for (const fav of favorites) {
      console.log(`\n  📖 Book ID ${fav.book_id}: "${fav.title}"`);
      
      // Check if this book has genres
      const [genres] = await connection.execute(
        `SELECT bg.name as genre_name
         FROM book_genre_relations bgr 
         JOIN book_genres bg ON bgr.genre_id = bg.id 
         WHERE bgr.book_id = ?`,
        [fav.book_id]
      );
      
      if (genres.length > 0) {
        console.log(`  ✅ HAS ${genres.length} genres: ${genres.map(g => g.genre_name).join(', ')}`);
        
        // Get recommendations
        const [recs] = await connection.execute(
          `SELECT DISTINCT b.id, b.title, COUNT(DISTINCT bgr2.genre_id) as matching_genres
           FROM books b
           LEFT JOIN book_genre_relations bgr2 ON b.id = bgr2.book_id
           WHERE bgr2.genre_id IN (
             SELECT DISTINCT genre_id 
             FROM book_genre_relations 
             WHERE book_id = ?
           )
           AND b.id != ?
           GROUP BY b.id, b.title
           ORDER BY matching_genres DESC
           LIMIT 10`,
          [fav.book_id, fav.book_id]
        );
        
        console.log(`\n  🎯 Found ${recs.length} recommendations:`);
        recs.forEach((rec, i) => {
          console.log(`    ${i+1}. ${rec.title} (${rec.matching_genres} matching genres)`);
        });
      } else {
        console.log(`  ❌ NO GENRES! This book needs genres assigned.`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkUser6();
