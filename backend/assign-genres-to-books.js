// Assign genres to popular books in the database
const mysql = require('mysql2/promise');
require('dotenv').config();

// Genre mappings based on book content
const bookGenreMappings = [
    // Jane Eyre - Historical Fiction, Romance, Gothic, Classic
    { title: 'Jane Eyre', genres: [6, 2, 12, 8] },
    // Wuthering Heights - Romance, Gothic, Classic, Literary Fiction
    { title: 'Wuthering Heights', genres: [2, 12, 8] },
    // Crime and Punishment - Classic, Philosophical Fiction, Psychological Thriller
    { title: 'Crime and Punishment', genres: [12, 8, 16] },
    // The Grapes of Wrath - Historical Fiction, Classic, Literary Fiction
    { title: 'The Grapes of Wrath', genres: [6, 12, 8] },
    // To Kill a Mockingbird - Classic, Literary Fiction, Historical Fiction
    { title: 'To Kill a Mockingbird', genres: [12, 8, 6] },
    // 1984 - Science Fiction, Dystopian, Classic
    { title: '1984', genres: [14, 12] },
    // Animal Farm - Satire, Political Fiction, Classic
    { title: 'Animal Farm', genres: [12] },
    // The Great Gatsby - Classic, Literary Fiction, Romance
    { title: 'The Great Gatsby', genres: [12, 8, 2] },
    // Brave New World - Science Fiction, Dystopian, Classic
    { title: 'Brave New World', genres: [14, 12] },
    // Lord of the Flies - Classic, Adventure, Literary Fiction
    { title: 'Lord of the Flies', genres: [12, 1, 8] },
    // The Catcher in the Rye - Classic, Literary Fiction
    { title: 'The Catcher in the Rye', genres: [12, 8] },
    // Moby-Dick - Classic, Adventure, Literary Fiction
    { title: 'Moby-Dick', genres: [12, 1, 8] },
    // War and Peace - Historical Fiction, Classic, Literary Fiction, Romance
    { title: 'War and Peace', genres: [6, 12, 8, 2] },
    // Anna Karenina - Classic, Romance, Literary Fiction
    { title: 'Anna Karenina', genres: [12, 2, 8] },
    // The Brothers Karamazov - Classic, Philosophical Fiction, Literary Fiction
    { title: 'The Brothers Karamazov', genres: [12, 8] },
    // Great Expectations - Classic, Literary Fiction, Historical Fiction
    { title: 'Great Expectations', genres: [12, 8, 6] },
    // A Tale of Two Cities - Historical Fiction, Classic, Literary Fiction
    { title: 'A Tale of Two Cities', genres: [6, 12, 8] },
    // Emma - Romance, Classic, Literary Fiction
    { title: 'Emma', genres: [2, 12, 8] },
    // Sense and Sensibility - Romance, Classic, Literary Fiction
    { title: 'Sense and Sensibility', genres: [2, 12, 8] },
    // Persuasion - Romance, Classic, Literary Fiction
    { title: 'Persuasion', genres: [2, 12, 8] },
];

async function assignGenres() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'taletrail_db'
        });

        console.log('\n🎨 Assigning genres to popular books...\n');

        let booksUpdated = 0;
        let genresAdded = 0;

        for (const mapping of bookGenreMappings) {
            // Find the book
            const [books] = await db.execute(
                'SELECT id, title FROM books WHERE title LIKE ?',
                [`%${mapping.title}%`]
            );

            if (books.length === 0) {
                console.log(`⚠️  Book not found: ${mapping.title}`);
                continue;
            }

            const book = books[0];
            console.log(`📖 ${book.title} (ID: ${book.id})`);

            // Add each genre
            for (const genreId of mapping.genres) {
                try {
                    await db.execute(
                        'INSERT IGNORE INTO book_genre_relations (book_id, genre_id) VALUES (?, ?)',
                        [book.id, genreId]
                    );
                    genresAdded++;
                    
                    // Get genre name
                    const [genreInfo] = await db.execute(
                        'SELECT name FROM book_genres WHERE id = ?',
                        [genreId]
                    );
                    if (genreInfo.length > 0) {
                        console.log(`   ✅ Added: ${genreInfo[0].name}`);
                    }
                } catch (error) {
                    console.log(`   ❌ Failed to add genre ${genreId}: ${error.message}`);
                }
            }

            booksUpdated++;
            console.log('');
        }

        console.log(`\n✅ Done! Updated ${booksUpdated} books with ${genresAdded} genre assignments\n`);

        // Show summary
        const [booksWithGenres] = await db.execute(`
            SELECT COUNT(DISTINCT b.id) as count
            FROM books b
            INNER JOIN book_genre_relations bgr ON b.id = bgr.book_id
        `);
        console.log(`📊 Total books with genres: ${booksWithGenres[0].count}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

assignGenres().catch(console.error);
