const db = require('./config/database');
const fs = require('fs');
const path = require('path');

async function fixViews() {
  try {
    console.log('🔧 Fixing database views after user_interactions removal...\n');

    // Drop broken views
    console.log('1. Dropping old views...');
    await db.query('DROP VIEW IF EXISTS book_stats');
    await db.query('DROP VIEW IF EXISTS trending_books');
    console.log('   ✅ Old views dropped\n');

    // Create new book_stats view
    console.log('2. Creating new book_stats view...');
    await db.query(`
      CREATE VIEW book_stats AS
      SELECT 
          b.id,
          b.title,
          b.author,
          b.average_rating,
          b.rating_count,
          c.name as country_name,
          c.code as country_code,
          COUNT(DISTINCT uf.user_id) as favorites_count
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      LEFT JOIN user_favorites uf ON b.id = uf.book_id
      GROUP BY b.id, b.title, b.author, b.average_rating, b.rating_count, c.name, c.code
    `);
    console.log('   ✅ book_stats view created\n');

    // Create new trending_books view
    console.log('3. Creating new trending_books view...');
    await db.query(`
      CREATE VIEW trending_books AS
      SELECT 
          b.*,
          c.name as country_name,
          c.code as country_code,
          COUNT(r.id) as recent_ratings,
          AVG(r.rating) as recent_avg_rating
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      LEFT JOIN ratings r ON b.id = r.book_id 
          AND r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY b.id
      HAVING recent_ratings > 0
      ORDER BY recent_ratings DESC, recent_avg_rating DESC
    `);
    console.log('   ✅ trending_books view created\n');

    // Verify views exist
    const [views] = await db.query(`
      SELECT TABLE_NAME 
      FROM information_schema.VIEWS 
      WHERE TABLE_SCHEMA = 'taletrail_db'
      ORDER BY TABLE_NAME
    `);
    
    console.log('📊 Current views in database:');
    views.forEach(v => console.log(`   - ${v.TABLE_NAME}`));

    console.log('\n✅ Views fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing views:', error.message);
    process.exit(1);
  }
}

fixViews();
