// Check all users with favorites
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAllFavorites() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taletrail_db'
    });
    
    console.log('🔍 Checking all users with favorites\n');
    
    const [users] = await db.execute(`
        SELECT u.id, u.username, u.email, COUNT(uf.book_id) as favorite_count
        FROM users u
        LEFT JOIN user_favorites uf ON u.id = uf.user_id
        GROUP BY u.id
        ORDER BY favorite_count DESC
    `);
    
    console.log('Users in database:');
    console.log('='.repeat(70));
    users.forEach(user => {
        console.log(`User ${user.id}: ${user.username} (${user.email})`);
        console.log(`  Favorites: ${user.favorite_count}`);
        console.log('');
    });
    
    await db.end();
}

checkAllFavorites().catch(console.error);
