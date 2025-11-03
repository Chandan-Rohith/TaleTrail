// List all genres
const mysql = require('mysql2/promise');
require('dotenv').config();

async function listGenres() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taletrail_db'
    });
    
    console.log('📚 All Genres in Database:\n');
    
    const [genres] = await db.execute(`SELECT * FROM book_genres ORDER BY id`);
    
    genres.forEach(g => {
        console.log(`ID ${g.id}: ${g.name}`);
    });
    
    await db.end();
}

listGenres().catch(console.error);
