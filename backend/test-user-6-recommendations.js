// Test recommendations for user 6
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testRecommendations() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'taletrail_db'
        });

        const userId = 6;
        console.log(`\n🔍 Testing recommendations for User ${userId} (Chandan Rohith)\n`);

        // Check favorites
        const [favorites] = await db.execute(
            'SELECT book_id FROM user_favorites WHERE user_id = ?',
            [userId]
        );
        console.log(`❤️  User has ${favorites.length} favorites`);
        
        if (favorites.length === 0) {
            console.log('⚠️  No favorites found! User needs to add favorites first.');
            return;
        }

        const favIds = favorites.map(f => f.book_id);
        console.log(`📚 Favorite book IDs: ${favIds.join(', ')}\n`);

        // Get genres for favorite books
        const placeholders = favIds.map(() => '?').join(',');
        const [favoriteGenres] = await db.execute(`
            SELECT b.id, b.title, g.id as genre_id, g.name as genre_name
            FROM books b
            LEFT JOIN book_genre_relations bgr ON b.id = bgr.book_id
            LEFT JOIN book_genres g ON bgr.genre_id = g.id
            WHERE b.id IN (${placeholders})
            ORDER BY b.id, g.name
        `, favIds);

        console.log('📖 Favorite books with their genres:');
        let currentBookId = null;
        for (const row of favoriteGenres) {
            if (row.id !== currentBookId) {
                console.log(`\n  ${row.title} (ID: ${row.id})`);
                currentBookId = row.id;
            }
            if (row.genre_name) {
                console.log(`    - ${row.genre_name}`);
            } else {
                console.log(`    ⚠️  NO GENRES ASSIGNED!`);
            }
        }

        // Try genre-based recommendations
        console.log('\n🎨 Finding books with matching genres...\n');
        const [genreBooks] = await db.execute(`
            SELECT b.id, b.title, b.author,
                   COUNT(DISTINCT bgr2.genre_id) as matching_genres,
                   GROUP_CONCAT(DISTINCT g.name) as genres
            FROM books b
            LEFT JOIN book_genre_relations bgr2 ON b.id = bgr2.book_id
            LEFT JOIN book_genres g ON bgr2.genre_id = g.id
            WHERE bgr2.genre_id IN (
              SELECT DISTINCT genre_id 
              FROM book_genre_relations 
              WHERE book_id IN (${placeholders})
            )
            AND b.id NOT IN (${placeholders})
            GROUP BY b.id, b.title, b.author
            ORDER BY matching_genres DESC, b.average_rating DESC
            LIMIT 10
        `, [...favIds, ...favIds]);

        if (genreBooks.length > 0) {
            console.log(`✅ Found ${genreBooks.length} recommendations:\n`);
            genreBooks.forEach((book, index) => {
                console.log(`${index + 1}. "${book.title}" by ${book.author}`);
                console.log(`   Matching genres: ${book.matching_genres}`);
                console.log(`   Genres: ${book.genres || 'none'}\n`);
            });
        } else {
            console.log('❌ No recommendations found!');
            console.log('   This means your favorite books have no genres assigned.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

testRecommendations().catch(console.error);
