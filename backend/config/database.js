const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taletrail_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Optionally skip DB connection test when developing without a database.
// Set environment variable `SKIP_DB_TEST=true` to skip the test.
if (process.env.SKIP_DB_TEST === 'true') {
  console.warn('⚠️ SKIP_DB_TEST is set; skipping database connection test.');
} else {
  // Test database connection
  async function testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Database connected successfully!');
      connection.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  }

  // Initialize database connection
  testConnection();
}

module.exports = pool;