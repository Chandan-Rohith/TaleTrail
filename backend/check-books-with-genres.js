// Check how many books have the same genres as Pride and Prejudice
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkBooksWithGenres() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'taletrail_db'
        });

        console.log('\n🔍 Checking books database for genre coverage\n');

        // Get total books
        const [totalBooks] = await db.execute('SELECT COUNT(*) as count FROM books');
        console.log(`📚 Total books in database: ${totalBooks[0].count}`);

        // Get total books with genres
        const [booksWithGenres] = await db.execute(`
            SELECT COUNT(DISTINCT b.id) as count
            FROM books b
            INNER JOIN book_genre_relations bgr ON b.id = bgr.book_id
        `);
        console.log(`🎨 Books with at least one genre: ${booksWithGenres[0].count}\n`);

        // Check Pride and Prejudice genres
        const [prideGenres] = await db.execute(`
            SELECT g.id, g.name 
            FROM book_genre_relations bgr
            JOIN book_genres g ON bgr.genre_id = g.id
            WHERE bgr.book_id = 44
            ORDER BY g.name
        `);

        console.log('📖 Pride and Prejudice (ID: 44) has these genres:');
        prideGenres.forEach(g => console.log(`   - ${g.name} (ID: ${g.id})`));

        if (prideGenres.length === 0) {
            console.log('   ⚠️  NO GENRES!');
            return;
        }

        // Check books with each of these genres
        console.log('\n🔎 Books with each genre:\n');
        for (const genre of prideGenres) {
            const [books] = await db.execute(`
                SELECT b.id, b.title, b.author
                FROM books b
                JOIN book_genre_relations bgr ON b.id = bgr.book_id
                WHERE bgr.genre_id = ? AND b.id != 44
                LIMIT 5
            `, [genre.id]);

            console.log(`${genre.name}:`);
            if (books.length > 0) {
                books.forEach(b => console.log(`  - "${b.title}" by ${b.author} (ID: ${b.id})`));
            } else {
                console.log(`  ⚠️  NO OTHER BOOKS with this genre!`);
            }
            console.log('');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

checkBooksWithGenres().catch(console.error);
