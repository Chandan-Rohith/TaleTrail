const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taletrail_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  User: ${dbConfig.user}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  Password: ${'*'.repeat(dbConfig.password.length)}\n`);

  try {
    // Create connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful!\n');
    
    // Test query
    const [rows] = await connection.query('SELECT VERSION() as version, DATABASE() as current_db');
    console.log('📊 Database Info:');
    console.log(`  MySQL Version: ${rows[0].version}`);
    console.log(`  Current Database: ${rows[0].current_db}\n`);
    
    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tables in database:');
    if (tables.length > 0) {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });
    } else {
      console.log('  ⚠️  No tables found in database');
    }
    
    connection.release();
    await pool.end();
    
    console.log('\n✅ All database tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible fixes:');
      console.error('  1. Make sure MySQL is running');
      console.error('  2. Check if MySQL is listening on port 3306');
      console.error('  3. Verify the host is correct (localhost)');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Possible fixes:');
      console.error('  1. Check username and password in .env file');
      console.error('  2. Verify user has access to the database');
      console.error('  3. Make sure user has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Possible fixes:');
      console.error('  1. Database "taletrail_db" does not exist');
      console.error('  2. Create the database using: CREATE DATABASE taletrail_db;');
    }
    
    process.exit(1);
  }
}

testDatabaseConnection();
