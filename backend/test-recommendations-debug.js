// Debug script to test recommendation logic
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testRecommendations() {
    console.log('🔍 Testing Recommendation Logic\n');
    
    // Create database connection
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taletrail_db'
    });
    
    console.log('✅ Connected to database\n');
    
    // Test user ID (change this to your user ID)
    const userId = 6;  // Chandan Rohith who has 1 favorite
    const limit = 10;
    
    try {
        // STEP 1: Check user favorites
        console.log(`STEP 1: Checking favorites for user ${userId}`);
        console.log('='.repeat(60));
        
        const [userFavs] = await db.execute(`
            SELECT uf.book_id, b.title, b.author
            FROM user_favorites uf
            JOIN books b ON uf.book_id = b.id
            WHERE uf.user_id = ?
        `, [userId]);
        
        console.log(`Found ${userFavs.length} favorites:`);
        userFavs.forEach(fav => {
            console.log(`  - Book ${fav.book_id}: ${fav.title} by ${fav.author}`);
        });
        console.log('');
        
        if (userFavs.length === 0) {
            console.log('❌ User has no favorites! Cannot generate recommendations.');
            await db.end();
            return;
        }
        
        const favIds = userFavs.map(f => f.book_id);
        
        // STEP 2: Check genres of favorite books
        console.log(`STEP 2: Checking genres of favorite books`);
        console.log('='.repeat(60));
        
        const placeholders = favIds.map(() => '?').join(',');
        const [favoriteGenres] = await db.execute(`
            SELECT DISTINCT b.id, b.title, bg.name as genre_name, bg.id as genre_id
            FROM books b
            JOIN book_genre_relations bgr ON b.id = bgr.book_id
            JOIN book_genres bg ON bgr.genre_id = bg.id
            WHERE b.id IN (${placeholders})
            ORDER BY b.id, bg.name
        `, favIds);
        
        console.log(`Favorite books have these genres:`);
        let currentBookId = null;
        favoriteGenres.forEach(row => {
            if (row.id !== currentBookId) {
                console.log(`\n  Book ${row.id}: ${row.title}`);
                currentBookId = row.id;
            }
            console.log(`    - Genre ${row.genre_id}: ${row.genre_name}`);
        });
        console.log('');
        
        // STEP 3: Find books with matching genres
        console.log(`STEP 3: Finding books with matching genres`);
        console.log('='.repeat(60));
        
        const placeholders1 = favIds.map(() => '?').join(',');
        const sqlQuery = `
            SELECT DISTINCT b.id, b.title, b.author, c.name as country_name,
                   COUNT(DISTINCT bgr2.genre_id) as matching_genres,
                   b.average_rating, b.rating_count
            FROM books b
            LEFT JOIN countries c ON b.country_id = c.id
            LEFT JOIN book_genre_relations bgr2 ON b.id = bgr2.book_id
            WHERE bgr2.genre_id IN (
              SELECT DISTINCT genre_id 
              FROM book_genre_relations 
              WHERE book_id IN (${placeholders1})
            )
            AND b.id NOT IN (${placeholders1})
            GROUP BY b.id, b.title, b.author, c.name, b.average_rating, b.rating_count
            ORDER BY matching_genres DESC, b.average_rating DESC, b.rating_count DESC
            LIMIT ?
        `;
        
        const [genreBooks] = await db.execute(sqlQuery, [...favIds, ...favIds, limit]);
        
        console.log(`Found ${genreBooks.length} books with matching genres:`);
        genreBooks.forEach((book, idx) => {
            console.log(`  ${idx + 1}. Book ${book.id}: ${book.title}`);
            console.log(`     Author: ${book.author}`);
            console.log(`     Country: ${book.country_name || 'Unknown'}`);
            console.log(`     Matching genres: ${book.matching_genres}`);
            console.log(`     Rating: ${book.average_rating} (${book.rating_count} ratings)`);
            console.log('');
        });
        
        if (genreBooks.length === 0) {
            console.log('⚠️ No books found with matching genres!');
            console.log('This could mean:');
            console.log('  1. Favorite books have no genres assigned');
            console.log('  2. No other books share those genres');
            console.log('  3. All matching books are already in favorites');
            console.log('');
            
            // Try country/author fallback
            console.log(`STEP 4: Trying country/author fallback`);
            console.log('='.repeat(60));
            
            const placeholders2 = favIds.map(() => '?').join(',');
            const [similarBooks] = await db.execute(`
                SELECT DISTINCT b.id, b.title, b.author, c.name as country_name,
                       b.average_rating, b.rating_count
                FROM books b
                LEFT JOIN countries c ON b.country_id = c.id
                WHERE (b.country_id IN (
                  SELECT DISTINCT country_id FROM books WHERE id IN (${placeholders2})
                ) OR b.author IN (
                  SELECT DISTINCT author FROM books WHERE id IN (${placeholders2})
                ))
                AND b.id NOT IN (${placeholders2})
                ORDER BY b.average_rating DESC, b.rating_count DESC
                LIMIT ?
            `, [...favIds, ...favIds, ...favIds, limit]);
            
            console.log(`Found ${similarBooks.length} books by same country/author:`);
            similarBooks.forEach((book, idx) => {
                console.log(`  ${idx + 1}. Book ${book.id}: ${book.title}`);
                console.log(`     Author: ${book.author}`);
                console.log(`     Country: ${book.country_name || 'Unknown'}`);
                console.log(`     Rating: ${book.average_rating}`);
                console.log('');
            });
        }
        
        console.log('\n✅ Test completed!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await db.end();
    }
}

testRecommendations().catch(console.error);
