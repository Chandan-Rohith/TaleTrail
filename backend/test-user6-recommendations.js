require('dotenv').config();
const mysql = require('mysql2/promise');

async function testRecommendationsForUser6() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🧪 Testing Recommendations API for User 6...\n');
    
    // Check user 6's favorites
    const [favorites] = await connection.execute(
      'SELECT book_id, (SELECT title FROM books WHERE id = book_id) as title FROM user_favorites WHERE user_id = 6'
    );
    
    console.log(`📚 User 6 favorites: ${favorites.length}`);
    favorites.forEach(fav => {
      console.log(`  - ${fav.title} (ID: ${fav.book_id})`);
    });
    
    if (favorites.length === 0) {
      console.log('\n❌ User 6 has NO favorites! Adding Pride and Prejudice...\n');
      await connection.execute(
        'INSERT INTO user_favorites (user_id, book_id) VALUES (6, 44) ON DUPLICATE KEY UPDATE created_at = NOW()'
      );
      console.log('✅ Added Pride and Prejudice to user 6 favorites');
    }
    
    // Now get recommendations using the same SQL query as the backend
    const [recs] = await connection.execute(`
      SELECT b.id, b.title, b.author, b.cover_image_url, b.average_rating,
             c.name as country_name,
             COUNT(DISTINCT bgr2.genre_id) as matching_genres
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      LEFT JOIN book_genre_relations bgr2 ON b.id = bgr2.book_id
      WHERE bgr2.genre_id IN (
        SELECT DISTINCT genre_id 
        FROM book_genre_relations 
        WHERE book_id IN (SELECT book_id FROM user_favorites WHERE user_id = 6)
      )
      AND b.id NOT IN (SELECT book_id FROM user_favorites WHERE user_id = 6)
      GROUP BY b.id, b.title, b.author, b.description, b.cover_image_url,
               b.average_rating, b.rating_count, b.publication_year,
               c.name, c.id
      ORDER BY matching_genres DESC, b.average_rating DESC, b.rating_count DESC
      LIMIT 10
    `);
    
    console.log(`\n🎯 Found ${recs.length} recommendations:\n`);
    
    if (recs.length > 0) {
      recs.forEach((rec, i) => {
        console.log(`  ${i+1}. ${rec.title} by ${rec.author}`);
        console.log(`     ${rec.matching_genres} matching genres | Rating: ${rec.average_rating} | Country: ${rec.country_name}\n`);
      });
      
      console.log('✅ SQL-based recommendations working!');
      console.log('\n💡 The backend API should return these same books.');
      console.log('   If you see user_id: 6 in the API response, recommendations will appear!');
    } else {
      console.log('❌ No recommendations found!');
      console.log('   This means the book_genre_relations table might be empty.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

testRecommendationsForUser6();
