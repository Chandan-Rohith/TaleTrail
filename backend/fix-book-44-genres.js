// Fix: Add genres to Pride and Prejudice (Book 44)
const mysql = require('mysql2/promise');
require('dotenv').config();

// Validate DB_PASSWORD is set
if (!process.env.DB_PASSWORD) {
    console.error('❌ ERROR: DB_PASSWORD environment variable is required');
    process.exit(1);
}

async function fixBook44Genres() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'taletrail_db'
        });
        
        console.log('🔧 Adding genres to Pride and Prejudice (Book 44)\n');
        
        // Pride and Prejudice should have:
        // - Romance (ID 2)
        // - Classic (ID 12)
        // - Literary Fiction (ID 8)
        // - Historical Fiction (ID 6)
        
        await db.execute(`
            INSERT IGNORE INTO book_genre_relations (book_id, genre_id) VALUES
            (44, 2),   -- Romance
            (44, 12),  -- Classic
            (44, 8),   -- Literary Fiction
            (44, 6)    -- Historical Fiction
        `);
        
        console.log('✅ Genres added successfully!\n');
        
        // Verify
        const [genres] = await db.execute(`
            SELECT bg.id, bg.name
            FROM book_genre_relations bgr
            JOIN book_genres bg ON bgr.genre_id = bg.id
            WHERE bgr.book_id = 44
        `);
        
        console.log('Pride and Prejudice now has these genres:');
        genres.forEach(g => console.log(`  - ${g.name} (ID: ${g.id})`));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

fixBook44Genres().catch(console.error);
