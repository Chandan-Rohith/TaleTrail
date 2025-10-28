-- TaleTrail Database Schema
-- Create database and tables for the book discovery platform

CREATE DATABASE IF NOT EXISTS taletrail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taletrail_db;

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS user_interactions;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS book_genres;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS countries;

-- Countries table
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL UNIQUE,
    coordinates JSON COMMENT 'Latitude and longitude for map display',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Books table with colorful book-themed structure
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(200) NOT NULL,
    description TEXT,
    publication_year INT,
    isbn VARCHAR(20),
    country_id INT,
    cover_image_url VARCHAR(500),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    INDEX idx_country (country_id),
    INDEX idx_rating (average_rating),
    INDEX idx_author (author),
    INDEX idx_title (title),
    FULLTEXT idx_search (title, author, description)
);

-- Ratings and reviews table
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id),
    INDEX idx_book_rating (book_id, rating),
    INDEX idx_user_rating (user_id, rating),
    INDEX idx_created (created_at)
);

-- User interactions for ML recommendations
CREATE TABLE user_interactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    interaction_type ENUM('view', 'rating', 'favorite', 'share') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_user_interactions (user_id, created_at),
    INDEX idx_book_interactions (book_id, created_at),
    INDEX idx_interaction_type (interaction_type),
    UNIQUE KEY unique_user_book_interaction (user_id, book_id, interaction_type)
);

-- Book genres/categories for better recommendations
CREATE TABLE book_genres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color_hex VARCHAR(7) DEFAULT '#8B1538' COMMENT 'Color for UI display',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between books and genres
CREATE TABLE book_genre_relations (
    book_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES book_genres(id) ON DELETE CASCADE
);

-- User favorites/bookmarks
CREATE TABLE user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, book_id),
    INDEX idx_user_favorites (user_id, created_at)
);

-- Create indexes for better performance
CREATE INDEX idx_books_country_rating ON books(country_id, average_rating DESC);
CREATE INDEX idx_ratings_recent ON ratings(created_at DESC);
CREATE INDEX idx_interactions_recent ON user_interactions(created_at DESC);

-- Create views for common queries
CREATE VIEW book_stats AS
SELECT 
    b.id,
    b.title,
    b.author,
    b.average_rating,
    b.rating_count,
    c.name as country_name,
    c.code as country_code,
    COUNT(DISTINCT ui.user_id) as unique_viewers,
    COUNT(DISTINCT uf.user_id) as favorites_count
FROM books b
LEFT JOIN countries c ON b.country_id = c.id
LEFT JOIN user_interactions ui ON b.id = ui.book_id AND ui.interaction_type = 'view'
LEFT JOIN user_favorites uf ON b.id = uf.book_id
GROUP BY b.id, b.title, b.author, b.average_rating, b.rating_count, c.name, c.code;

-- View for trending books (books with recent activity)
CREATE VIEW trending_books AS
SELECT 
    b.*,
    c.name as country_name,
    c.code as country_code,
    COUNT(ui.id) as recent_interactions,
    AVG(r.rating) as recent_avg_rating
FROM books b
LEFT JOIN countries c ON b.country_id = c.id
LEFT JOIN user_interactions ui ON b.id = ui.book_id AND ui.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
LEFT JOIN ratings r ON b.id = r.book_id AND r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY b.id
HAVING recent_interactions > 0
ORDER BY recent_interactions DESC, recent_avg_rating DESC;