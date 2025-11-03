// Configuration for TaleTrail Frontend
const CONFIG = {
    // API URLs
    // For local development
    API_BASE_URL: 'http://localhost:3000/api',
    ML_API_URL: 'http://localhost:5000', // ML service runs on port 5000
    
    // Map configuration
    MAP_CENTER: [20, 0],
    MAP_ZOOM: 2,
    
    // UI Configuration
    BOOKS_PER_PAGE: 20,
    TRENDING_LIMIT: 12,
    RECOMMENDATIONS_LIMIT: 10,
    
    // Toast duration
    TOAST_DURATION: 4000,
    
    // Default book cover
    DEFAULT_BOOK_COVER: 'https://via.placeholder.com/300x400/8b1538/ffffff?text=Book+Cover',
    
    // Country colors for map
    COUNTRY_COLORS: {
        default: '#2a9d8f',
        hover: '#f4a261',
        selected: '#8b1538'
    }
};