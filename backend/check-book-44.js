// Check if book 44 (Pride and Prejudice) has genres
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkBook44() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'taletrail_db'
        });
        
        console.log('🔍 Checking Book 44 (Pride and Prejudice)\n');
        
        const [bookInfo] = await db.execute(`
            SELECT * FROM books WHERE id = 44
        `);
        
        console.log('Book Info:');
        console.log(bookInfo[0]);
        console.log('');
        
        const [genres] = await db.execute(`
            SELECT bg.* 
            FROM book_genre_relations bgr
            JOIN book_genres bg ON bgr.genre_id = bg.id
            WHERE bgr.book_id = 44
        `);
        
        console.log(`Genres assigned: ${genres.length}`);
        if (genres.length > 0) {
            genres.forEach(g => console.log(`  - ${g.name}`));
        } else {
            console.log('  ❌ NO GENRES ASSIGNED!');
        }
    } finally {
        if (db) {
            await db.end();
        }
    }
}

checkBook44().catch(console.error);
