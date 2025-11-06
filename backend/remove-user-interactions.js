require('dotenv').config();
const mysql = require('mysql2/promise');

async function removeUserInteractions() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'taletrail_db'
    });

    console.log('✅ Connected to database\n');

    // Check if table has data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM user_interactions');
    console.log(`📊 Current records in user_interactions: ${rows[0].count}`);

    // Drop the table
    await connection.query('DROP TABLE IF EXISTS user_interactions');
    console.log('✅ Dropped table: user_interactions\n');

    // Verify remaining tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Remaining tables:', tables.length);
    tables.forEach(t => console.log('  -', Object.values(t)[0]));

    await connection.end();
    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeUserInteractions();
