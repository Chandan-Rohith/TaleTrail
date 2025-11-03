require('dotenv').config();
const mysql = require('mysql2/promise');

async function findUserByEmail() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('\n🔍 Searching for user with email: 2410030061@klh.edu.in\n');
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email LIKE ?',
      ['%2410030061%']
    );
    
    if (users.length === 0) {
      console.log('❌ No user found with that email!');
      console.log('\n📋 All emails in database:');
      const [allUsers] = await connection.execute('SELECT id, username, email FROM users ORDER BY id');
      allUsers.forEach(u => {
        console.log(`  ${u.id}. ${u.username} - ${u.email}`);
      });
    } else {
      console.log(`✅ Found ${users.length} matching user(s):\n`);
      users.forEach(user => {
        console.log(`  ID: ${user.id}`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Created: ${user.created_at}\n`);
      });
      
      // Check their favorites
      for (const user of users) {
        const [favs] = await connection.execute(
          'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ?',
          [user.id]
        );
        console.log(`  User ${user.id} has ${favs[0].count} favorites`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

findUserByEmail();
