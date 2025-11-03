// List all books in the database
const mysql = require('mysql2/promise');
require('dotenv').config();

async function listAllBooks() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'taletrail_db'
        });

        const [books] = await db.execute(`
            SELECT id, title, author, 
                   (SELECT COUNT(*) FROM book_genre_relations WHERE book_id = books.id) as genre_count
            FROM books 
            ORDER BY id
        `);

        console.log(`\n📚 Total books: ${books.length}\n`);
        
        let withGenres = 0;
        let withoutGenres = 0;
        
        books.forEach(book => {
            const hasGenres = book.genre_count > 0 ? '✅' : '❌';
            console.log(`${hasGenres} ${book.id}: "${book.title}" by ${book.author} (${book.genre_count} genres)`);
            
            if (book.genre_count > 0) {
                withGenres++;
            } else {
                withoutGenres++;
            }
        });

        console.log(`\n📊 Summary:`);
        console.log(`   With genres: ${withGenres}`);
        console.log(`   Without genres: ${withoutGenres}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

listAllBooks().catch(console.error);
