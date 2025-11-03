require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUserFavoritesAndGenres() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🔍 Checking User 10 Favorites and Their Genres...\n');
    
    // Get user's favorites
    const [favorites] = await connection.execute(
      'SELECT uf.book_id, b.title FROM user_favorites uf JOIN books b ON uf.book_id = b.id WHERE uf.user_id = ?',
      [10]
    );
    
    console.log(`📚 User 10 has ${favorites.length} favorite(s):`);
    
    for (const fav of favorites) {
      console.log(`\n  Book ID ${fav.book_id}: "${fav.title}"`);
      
      // Check if this book has genres
      const [genres] = await connection.execute(
        `SELECT bg.genre_name 
         FROM book_genre_relations bgr 
         JOIN book_genres bg ON bgr.genre_id = bg.id 
         WHERE bgr.book_id = ?`,
        [fav.book_id]
      );
      
      if (genres.length > 0) {
        console.log(`  ✅ HAS ${genres.length} genres: ${genres.map(g => g.genre_name).join(', ')}`);
      } else {
        console.log(`  ❌ NO GENRES! This is why recommendations are empty!`);
      }
    }
    
    // Now check how many books have genres in total
    console.log('\n📊 Overall Database Stats:');
    const [totalBooks] = await connection.execute('SELECT COUNT(*) as count FROM books');
    const [booksWithGenres] = await connection.execute(
      'SELECT COUNT(DISTINCT book_id) as count FROM book_genre_relations'
    );
    
    console.log(`  Total books: ${totalBooks[0].count}`);
    console.log(`  Books with genres: ${booksWithGenres[0].count}`);
    
    // List books WITH genres
    console.log('\n📖 Books that HAVE genres:');
    const [genreBooks] = await connection.execute(
      `SELECT DISTINCT b.id, b.title, COUNT(bgr.genre_id) as genre_count
       FROM books b
       JOIN book_genre_relations bgr ON b.id = bgr.book_id
       GROUP BY b.id, b.title
       ORDER BY b.id`
    );
    
    genreBooks.forEach(book => {
      console.log(`  ${book.id}. ${book.title} (${book.genre_count} genres)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkUserFavoritesAndGenres();
