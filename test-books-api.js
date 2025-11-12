// Quick test to check books API endpoint
const mysql = require('mysql2/promise');

async function testBooksQuery() {
  try {
    const db = await mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'taletrail_db',
    });

    console.log('✅ Database connected');

    // Test the exact query from the API with search
    const search = 'Sherlock';
    const params = [`%${search}%`, `%${search}%`, `%${search}%`];
    
    const whereClause = 'WHERE (b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?) AND b.id IN (SELECT MIN(id) FROM books GROUP BY title, author)';
    
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.publication_year,
        b.isbn,
        b.cover_image_url,
        b.average_rating,
        b.rating_count,
        c.name as country_name,
        c.code as country_code
      FROM books b
      LEFT JOIN countries c ON b.country_id = c.id
      ${whereClause}
      ORDER BY b.average_rating DESC, b.rating_count DESC
      LIMIT 5 OFFSET 0
    `;

    console.log('\n📊 Testing books query with search "Sherlock"...');
    const [books] = await db.execute(query, params);
    console.log(`✅ Found ${books.length} books`);
    books.forEach(book => {
      console.log(`  - ${book.title} by ${book.author}`);
    });

    // Test count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT b.id
        FROM books b
        LEFT JOIN countries c ON b.country_id = c.id
        ${whereClause}
      ) as deduplicated_books
    `;
    
    console.log('\n📊 Testing count query...');
    const [countResult] = await db.execute(countQuery, params);
    console.log(`✅ Total count: ${countResult[0].total}`);

    await db.end();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

testBooksQuery();
