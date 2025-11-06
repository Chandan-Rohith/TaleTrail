const db = require('./config/database');

async function removeViews() {
  try {
    console.log('🗑️  Removing unused database views...\n');

    // Check if views exist
    const [existingViews] = await db.query(`
      SELECT TABLE_NAME 
      FROM information_schema.VIEWS 
      WHERE TABLE_SCHEMA = 'taletrail_db'
      ORDER BY TABLE_NAME
    `);
    
    if (existingViews.length === 0) {
      console.log('✅ No views found - database is already clean!\n');
      process.exit(0);
    }

    console.log('Found views:');
    existingViews.forEach(v => console.log(`   - ${v.TABLE_NAME}`));
    console.log('');

    // Drop views
    console.log('Dropping views...');
    await db.query('DROP VIEW IF EXISTS book_stats');
    console.log('   ✅ Dropped: book_stats');
    
    await db.query('DROP VIEW IF EXISTS trending_books');
    console.log('   ✅ Dropped: trending_books');

    console.log('\n✅ All views removed successfully!');
    console.log('\n📝 Why views were removed:');
    console.log('   • Not used in application code');
    console.log('   • Trending books calculated in backend/routes/books.js');
    console.log('   • Views add complexity without benefit');
    console.log('   • Performance: Direct queries are faster');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeViews();
