// Configuration for TaleTrail Frontend
// Environment detection: localhost, 127.0.0.1, local IPs, and *.local domains treated as development
const isDevelopment = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d{1,3}\.\d{1,3}|.*\.local)$/i.test(window.location.hostname);

const CONFIG = {
    // API URLs - automatically detect environment based on hostname
    API_BASE_URL: isDevelopment
        ? 'http://localhost:3000/api'
        : 'https://taletrail-backend-z2xb.onrender.com/api',
    
    ML_API_URL: isDevelopment
        ? 'http://localhost:5000'
        : 'https://taletrail-ml-service.onrender.com',
    
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