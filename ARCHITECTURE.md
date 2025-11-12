# TaleTrail - Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Presentation)                    │
│                         HTML / CSS / JavaScript                          │
│                            Responsive UI                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │   index.html     │  │   main.html      │  │   profile.html   │      │
│  │   (Landing Page) │  │   (Main App)     │  │   (User Profile) │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│           │                     │                      │                 │
│           │                     │                      │                 │
│  ┌────────┴─────────────────────┴──────────────────────┴──────┐        │
│  │                    Shared Frontend Components               │        │
│  ├──────────────────────────────────────────────────────────────┤       │
│  │  js/config.js      - API Configuration & Constants          │       │
│  │  js/auth.js        - Authentication Manager (JWT)           │       │
│  │  js/api.js         - API Service & HTTP Client             │       │
│  │  js/books.js       - Book Display & UI Logic               │       │
│  │  js/main.js        - Main App Controller & Navigation      │       │
│  │  js/map.js         - Interactive World Map (Leaflet)       │       │
│  ├──────────────────────────────────────────────────────────────┤       │
│  │  styles/main.css   - Global Styling & Theme                │       │
│  │  styles/leaflet-fixes.css - Map Customization             │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  Features:                                                                │
│  • Interactive World Map with Country Selection                          │
│  • Book Search & Filtering                                               │
│  • User Authentication (Login/Signup)                                    │
│  • Book Rating & Reviews                                                 │
│  • Personalized Recommendations                                          │
│  • Favorites Management                                                  │
│  • Responsive Design (Mobile-First)                                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/REST API
                                    │ JSON Data Exchange
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER (Business Logic)                │
│                         Node.js + Express.js                             │
│                      User Interactions & Logic                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │                    server.js (Main Server)                  │        │
│  │  • CORS Configuration (Multiple Origins)                    │        │
│  │  • Security (Helmet, Rate Limiting)                         │        │
│  │  • Route Management                                         │        │
│  │  • Error Handling Middleware                               │        │
│  └─────────────────────────────────────────────────────────────┘        │
│           │                                                               │
│           ├─────────────────────────────────────────────┐               │
│           │                                             │               │
│  ┌────────▼────────────┐                    ┌──────────▼──────────┐    │
│  │  Middleware Layer   │                    │   Routes Layer      │    │
│  ├─────────────────────┤                    ├─────────────────────┤    │
│  │ • auth.js           │                    │ • auth.js           │    │
│  │   - JWT Validation  │                    │   - Login/Signup    │    │
│  │   - Token Verify    │◄───────────────────┤   - Token Refresh   │    │
│  │   - optionalAuth    │                    │                     │    │
│  └─────────────────────┘                    │ • books.js          │    │
│                                              │   - Get All Books   │    │
│                                              │   - Search & Filter │    │
│                                              │   - Get by Country  │    │
│  ┌─────────────────────┐                    │   - Trending Books  │    │
│  │  Database Config    │                    │   - Book Details    │    │
│  ├─────────────────────┤                    │                     │    │
│  │ • database.js       │                    │ • countries.js      │    │
│  │   - MySQL Pool      │◄───────────────────┤   - List Countries  │    │
│  │   - Connection Mgmt │                    │   - Country Stats   │    │
│  │   - Query Execution │                    │                     │    │
│  └─────────────────────┘                    │ • recommendations.js│    │
│                                              │   - User-based Recs │    │
│                                              │   - Similar Books   │    │
│  ┌──────────────────────────────┐           │   - Trending        │    │
│  │   Utility Scripts            │           │                     │    │
│  ├──────────────────────────────┤           │ • user.js           │    │
│  │ • assign-genres-to-books.js  │           │   - Rate Books      │    │
│  │ • check-books-with-genres.js │           │   - User Ratings    │    │
│  │ • remove-user-interactions.js│           │   - User Stats      │    │
│  │ • fix-database-views.js      │           │                     │    │
│  └──────────────────────────────┘           │ • favorites.js      │    │
│                                              │   - Add Favorite    │    │
│                                              │   - Remove Favorite │    │
│                                              │   - List Favorites  │    │
│                                              │                     │    │
│                                              │ • admin.js          │    │
│                                              │   - Admin Dashboard │    │
│                                              │   - Data Management │    │
│                                              └─────────────────────┘    │
│                                                                           │
│  Features:                                                                │
│  • RESTful API Design                                                    │
│  • JWT-based Authentication                                              │
│  • Rate Limiting (1000 req/min)                                          │
│  • CORS Security                                                         │
│  • Request Validation                                                    │
│  • Error Handling & Logging                                              │
│  • Connection Pooling                                                    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ MySQL Protocol
                                    │ SQL Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (Persistence)                         │
│                          MySQL Database                                  │
│                         Static Data Storage                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │                    Database: taletrail_db                   │        │
│  └─────────────────────────────────────────────────────────────┘        │
│           │                                                               │
│           ├──────────────────────────────────────────────────┐          │
│           │                                                   │          │
│  ┌────────▼──────────┐  ┌──────────────┐  ┌─────────────────▼──────┐  │
│  │  Core Tables      │  │ User Tables  │  │  Interaction Tables    │  │
│  ├───────────────────┤  ├──────────────┤  ├────────────────────────┤  │
│  │                   │  │              │  │                        │  │
│  │ • books           │  │ • users      │  │ • ratings              │  │
│  │   - id (PK)       │  │   - id (PK)  │  │   - id (PK)            │  │
│  │   - title         │  │   - username │  │   - user_id (FK)       │  │
│  │   - author        │  │   - email    │  │   - book_id (FK)       │  │
│  │   - description   │  │   - password │  │   - rating (1-5)       │  │
│  │   - pub_year      │  │   - created  │  │   - review_text        │  │
│  │   - isbn          │  │              │  │   - created_at         │  │
│  │   - cover_url     │  └──────────────┘  │                        │  │
│  │   - avg_rating    │                    │ • favorites            │  │
│  │   - rating_count  │                    │   - id (PK)            │  │
│  │   - country_id    │                    │   - user_id (FK)       │  │
│  │                   │                    │   - book_id (FK)       │  │
│  │ • countries       │                    │   - created_at         │  │
│  │   - id (PK)       │                    │                        │  │
│  │   - name          │                    └────────────────────────┘  │
│  │   - code (ISO)    │                                                  │
│  │   - latitude      │                                                  │
│  │   - longitude     │                                                  │
│  │                   │                                                  │
│  │ • genres          │                                                  │
│  │   - id (PK)       │                                                  │
│  │   - name          │                                                  │
│  │                   │                                                  │
│  │ • book_genres     │                                                  │
│  │   - book_id (FK)  │                                                  │
│  │   - genre_id (FK) │                                                  │
│  └───────────────────┘                                                  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────┐           │
│  │                   SQL Management Files                   │           │
│  ├──────────────────────────────────────────────────────────┤           │
│  │ • schema.sql              - Database Structure           │           │
│  │ • sample_data.sql         - Initial Book Data           │           │
│  │ • add_books_corrected.sql - Additional Books            │           │
│  │ • add_more_books.sql      - Extended Catalog            │           │
│  │ • update_covers.sql       - Cover Image Updates         │           │
│  │ • update_local_covers.sql - Local Image References      │           │
│  │ • cover_images_guide.sql  - Cover Management Guide      │           │
│  │ • taletrail_backup.sql    - Full Database Backup        │           │
│  ├──────────────────────────────────────────────────────────┤           │
│  │ • run_sql_files.bat       - Windows Batch Script        │           │
│  │ • run_sql_files.ps1       - PowerShell Script           │           │
│  └──────────────────────────────────────────────────────────┘           │
│                                                                           │
│  Features:                                                                │
│  • Relational Data Model                                                 │
│  • Normalized Schema (3NF)                                               │
│  • Foreign Key Constraints                                               │
│  • Indexed Columns (Performance)                                         │
│  • Connection Pooling                                                    │
│  • Transaction Support                                                   │
│  • Data Integrity & Validation                                           │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Books
- `GET /api/books` - Get all books (with filtering)
  - Query params: `country`, `author`, `search`, `sort`, `order`, `limit`, `offset`
- `GET /api/books/trending` - Get trending books
- `GET /api/books/:id` - Get book details with reviews
- `GET /api/books/country/:countryCode` - Get books by country

### Countries
- `GET /api/countries` - List all countries
- `GET /api/countries/:code` - Get country details with statistics

### Recommendations
- `GET /api/recommendations/user/:userId` - Get personalized recommendations
- `GET /api/recommendations/similar/:bookId` - Get similar books
- `GET /api/recommendations/trending` - Get trending recommendations

### User
- `POST /api/user/rate` - Rate a book (requires auth)
- `GET /api/user/ratings` - Get user's ratings (requires auth)
- `GET /api/user/stats` - Get user statistics (requires auth)

### Favorites
- `GET /api/favorites` - Get user's favorites (requires auth)
- `POST /api/favorites/:bookId` - Add book to favorites (requires auth)
- `DELETE /api/favorites/:bookId` - Remove from favorites (requires auth)

### Admin
- Various admin endpoints for data management (requires admin auth)

### Health Check
- `GET /health` - Server health check
- `GET /api/health` - API health check

## Data Flow

### 1. User Authentication Flow
```
User → Login Form → POST /api/auth/login → Validate Credentials → Generate JWT
       ↓
    Store Token in localStorage → Include in Authorization Header → Verify on Each Request
```

### 2. Book Discovery Flow
```
User → Map Interaction → Click Country → GET /api/books/country/:code
       ↓
    Display Books → Click Book → GET /api/books/:id → Show Details + Reviews
```

### 3. Recommendation Flow
```
User Actions (Ratings) → Stored in Database → Algorithm Processing
       ↓
    GET /api/recommendations/user/:userId → Return Personalized Books
```

### 4. Search Flow
```
User Input → Debounce (300ms) → GET /api/books?search=query
       ↓
    Filter by title/author/description → Return Results → Display
```

## Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables
- **Vanilla JavaScript** - No framework dependencies
- **Leaflet.js** - Interactive maps
- **Font Awesome** - Icons
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver with promise support
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment configuration

### Database
- **MySQL 8.0+** - Relational database
- **Stored data** - Books, users, ratings, favorites, countries

## Security Features

1. **JWT Authentication** - Stateless token-based auth
2. **Password Hashing** - Bcrypt with salt rounds
3. **Rate Limiting** - 1000 requests per minute per IP
4. **CORS Protection** - Configured allowed origins
5. **Helmet.js** - Security headers
6. **SQL Injection Prevention** - Parameterized queries
7. **XSS Protection** - Input sanitization
8. **HTTPS Ready** - Production deployment ready

## Deployment Structure

```
TaleTrail/
├── frontend/           → Static files (served by web server)
│   ├── index.html     → Landing page
│   ├── main.html      → Main application
│   ├── profile.html   → User profile
│   ├── js/            → JavaScript modules
│   ├── styles/        → CSS files
│   └── images/        → Static assets
│
├── backend/            → Node.js server (runs on port 3000)
│   ├── server.js      → Entry point
│   ├── config/        → Configuration
│   ├── middleware/    → Express middleware
│   ├── routes/        → API routes
│   └── package.json   → Dependencies
│
└── database/           → MySQL scripts
    ├── schema.sql     → Database structure
    ├── sample_data.sql → Initial data
    └── *.sql          → Various SQL scripts
```

## Development vs Production

### Development
- Frontend: Live Server (port 5500+)
- Backend: Node.js (port 3000)
- Database: Local MySQL
- CORS: Permissive (localhost origins)

### Production
- Frontend: Static hosting (Netlify, Vercel, etc.)
- Backend: Cloud hosting (Render, Railway, etc.)
- Database: Managed MySQL (PlanetScale, etc.)
- CORS: Restricted origins
- Environment variables for configuration
- HTTPS enforced
- Rate limiting enforced
- Connection pooling optimized

## Performance Optimizations

1. **Database Connection Pooling** - Reuse connections
2. **Query Optimization** - Indexed columns, efficient JOINs
3. **Deduplication Strategy** - Prevent duplicate books in results
4. **Rate Limiting** - Prevent API abuse
5. **Lazy Loading** - Load data on demand
6. **Debounced Search** - Reduce API calls
7. **Image Optimization** - Local caching, placeholders
8. **Pagination** - Limit data transfer

## Future Enhancements

- [ ] Book cover CDN integration
- [ ] Advanced recommendation algorithm (ML-based)
- [ ] Social features (friend connections)
- [ ] Reading lists and challenges
- [ ] Mobile app (React Native)
- [ ] Book reviews moderation
- [ ] Admin dashboard improvements
- [ ] Analytics and insights
- [ ] Multilingual support
- [ ] Dark mode theme
