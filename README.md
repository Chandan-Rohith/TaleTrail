# 📚 TaleTrail - Discover Books Around the World

A colorful, interactive book discovery platform that takes you on a literary journey across the globe.

## �️ Architecture Overview

### Three-Tier Architecture
```
┌──────────────────────────────┐
│   CLIENT LAYER (Frontend)   │  ← HTML/CSS/JavaScript
│   Responsive UI              │  ← Leaflet Maps, API Client
└──────────────────────────────┘
              ↕ REST API (JSON)
┌──────────────────────────────┐
│ APPLICATION LAYER (Backend)  │  ← Node.js + Express.js
│ Business Logic & Auth        │  ← JWT, Rate Limiting
└──────────────────────────────┘
              ↕ SQL Queries
┌──────────────────────────────┐
│   DATA LAYER (Database)      │  ← MySQL
│   Books, Users, Ratings      │  ← Connection Pooling
└──────────────────────────────┘
```

## 🔑 Key Components

### Frontend (`/frontend`)
- **Pages**: index.html, main.html, profile.html
- **JS Modules**: api.js (HTTP), auth.js (JWT), books.js (UI), main.js (Controller), map.js (Leaflet)
- **Tech**: Vanilla JS, Leaflet.js, Fetch API

### Backend (`/backend`)
- **Server**: Express.js (Port 3000)
- **Routes**: auth, books, countries, recommendations, user, favorites, admin
- **Security**: JWT auth, Helmet, CORS, Rate limiting (1000/min)
- **Database**: MySQL connection pooling

### Database (`/database`)
- **Tables**: books, countries, users, ratings, favorites, genres, book_genres
- **Files**: schema.sql, sample_data.sql

## 📡 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login (returns JWT) |
| `/api/books` | GET | Get books (filter, search, sort) |
| `/api/books/trending` | GET | Trending books |
| `/api/books/:id` | GET | Book details + reviews |
| `/api/books/country/:code` | GET | Books by country |
| `/api/user/rate` | POST | Rate book (auth required) |
| `/api/favorites/:bookId` | POST/DELETE | Add/remove favorite |
| `/api/recommendations/user/:id` | GET | Personalized recommendations |

## 🚀 Quick Start

### 1. Database Setup
```bash
cd database
mysql -u root -p < schema.sql
mysql -u root -p < sample_data.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file with DB credentials
npm start  # Runs on port 3000
```

### 3. Frontend Setup
```bash
cd frontend
# Use Live Server or:
python -m http.server 5500
```

## ✨ Features
- 🗺️ Interactive world map (Leaflet.js)
- 🔍 Search & filter books
- ⭐ User ratings & reviews
- 🔐 JWT authentication
- ❤️ Favorites management
- 📊 Personalized recommendations
- 📱 Responsive design

## 🔒 Security
- JWT token authentication
- Bcrypt password hashing
- Rate limiting (1000 req/min)
- CORS protection
- Parameterized SQL queries
- Helmet.js security headers

## 📦 Tech Stack
**Frontend**: HTML5, CSS3, Vanilla JS, Leaflet.js  
**Backend**: Node.js, Express.js, MySQL2, JWT, Bcrypt  
**Database**: MySQL 8.0+  
**Security**: Helmet, CORS, Rate-limit

## 📁 Project Structure
```
taletrail/
├── frontend/          # Client layer (UI)
├── backend/           # Application layer (API)
├── database/          # Data layer (MySQL)
├── ARCHITECTURE.md    # Detailed architecture doc
└── README.md          # This file
```

Built with ❤️ for book lovers everywhere.