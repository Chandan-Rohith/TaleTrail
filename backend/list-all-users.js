require('dotenv').config();
const mysql = require('mysql2/promise');

async function listUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n👥 All Users in Railway Database:\n');
    
    const [users] = await connection.execute(
      'SELECT id, username, email, created_at FROM users ORDER BY id'
    );
    
    if (users.length === 0) {
      console.log('❌ NO USERS FOUND! You need to create an account on the production site.');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach(user => {
        console.log(`  ID ${user.id}: ${user.username} (${user.email}) - Created: ${user.created_at}`);
      });
      
      // Check favorites for each user
      console.log('\n📚 Favorites per user:');
      for (const user of users) {
        const [favs] = await connection.execute(
          'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?',
          [user.id]
        );
        console.log(`  User ${user.id} (${user.username}): ${favs[0].count} favorites`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

listUsers();
