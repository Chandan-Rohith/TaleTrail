// API Helper Functions
class APIService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.mlURL = CONFIG.ML_API_URL;
    }

    async makeRequest(url, options = {}) {
        try {
            // Get auth headers safely, with fallback if authManager isn't available
            const authHeaders = (window.authManager && typeof window.authManager.getAuthHeaders === 'function')
                ? window.authManager.getAuthHeaders()
                : { 'Content-Type': 'application/json' };

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders,
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Books API
    async getBooks(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.makeRequest(`${this.baseURL}/books?${queryString}`);
    }

    async getBook(bookId) {
        return this.makeRequest(`${this.baseURL}/books/${bookId}`);
    }

    async getBooksByCountry(countryCode, limit = 10) {
        return this.makeRequest(`${this.baseURL}/books/country/${countryCode}?limit=${limit}`);
    }

    // Countries API
    async getCountries() {
        return this.makeRequest(`${this.baseURL}/countries`);
    }

    async getCountry(countryCode) {
        return this.makeRequest(`${this.baseURL}/countries/${countryCode}`);
    }

    // Recommendations API
    async getTrendingBooks(limit = 12) {
        return this.makeRequest(`${this.baseURL}/books/trending?limit=${limit}`);
    }

    async getUserRecommendations(userId, limit = 10) {
        return this.makeRequest(`${this.baseURL}/recommendations/user/${userId}?limit=${limit}`);
    }

    async getSimilarBooks(bookId, limit = 5) {
        return this.makeRequest(`${this.baseURL}/recommendations/similar/${bookId}?limit=${limit}`);
    }

    // User API
    async rateBook(bookId, rating, reviewText = '') {
        return this.makeRequest(`${this.baseURL}/user/rate`, {
            method: 'POST',
            body: JSON.stringify({
                bookId: parseInt(bookId),
                rating: parseInt(rating),
                reviewText
            })
        });
    }

    async getUserRatings() {
        return this.makeRequest(`${this.baseURL}/user/ratings`);
    }

    async getUserStats() {
        return this.makeRequest(`${this.baseURL}/user/stats`);
    }

    // Favorites API
    async getUserFavorites() {
        return this.makeRequest(`${this.baseURL}/favorites`);
    }

    async addFavorite(bookId) {
        return this.makeRequest(`${this.baseURL}/favorites/${bookId}`, {
            method: 'POST'
        });
    }

    async removeFavorite(bookId) {
        return this.makeRequest(`${this.baseURL}/favorites/${bookId}`, {
            method: 'DELETE'
        });
    }

    async isFavorite(bookId) {
        try {
            const data = await this.getUserFavorites();
            return data.favorites.some(fav => fav.id === bookId);
        } catch (error) {
            return false;
        }
    }
}

// Initialize API service
const apiService = new APIService();

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, CONFIG.TOAST_DURATION);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Loading States
function showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container with id "${containerId}" not found`);
        return;
    }
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-book-open spin"></i>
            <p>${message}</p>
        </div>
    `;
}

function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container with id "${containerId}" not found`);
        return;
    }
    container.innerHTML = '';
}

// Utility Functions
function formatRating(rating) {
    return parseFloat(rating || 0).toFixed(1);
}

function createStars(rating, interactive = false) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<i class="fas fa-star${interactive ? ' interactive' : ''}"></i>`;
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += `<i class="fas fa-star-half-alt${interactive ? ' interactive' : ''}"></i>`;
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `<i class="far fa-star empty${interactive ? ' interactive' : ''}"></i>`;
    }
    
    return starsHTML;
}

function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function getBookCoverUrl(book) {
    // Map of book titles to image filenames
    const imageMap = {
        // UK Books
        'Pride and Prejudice': 'pride_prejudice.jpg',
        'The Lord of the Rings': 'lord_rings.jpg',
        'Lord of the Rings': 'lord_rings.jpg',
        'The Adventures of Sherlock Holmes': 'sherlock_holmes.jpg',
        'Sherlock Holmes': 'sherlock_holmes.jpg',
        'Jane Eyre': 'jane_eyre.jpg',
        'Animal Farm': 'animal_farm.jpg',
        'Wuthering Heights': 'wuthering_heights.jpg',
        'The Chronicles of Narnia': 'chronicles_narnia.jpg',
        'Chronicles of Narnia': 'chronicles_narnia.jpg',
        
        // US Books
        'The Catcher in the Rye': 'catcher_rye.jpg',
        'Gone with the Wind': 'gone_wind.jpg',
        'Adventures of Huckleberry Finn': 'huck_finn.jpg',
        'Of Mice and Men': 'mice_men.jpg',
        'The Grapes of Wrath': 'grapes_wrath.jpg',
        'Moby Dick': 'moby_dick.jpg',
        '1984': '1984.jpg',
        'The Great Gatsby': 'great-gatsby.jpg',
        'To Kill a Mockingbird': 'mockingbird.jpg',
        'The Scarlet Letter': 'scarlet_letter.jpg',
        "Harry Potter and the Philosopher's Stone": 'harry-potter.jpg',
        "Harry Potter": 'harry-potter.jpg',
        'Beloved': 'beloved.jpg',
        
        // French Books
        'The Little Prince': 'little-prince.jpg',
        'Les Misérables': 'les_miserables.jpg',
        'Les Miserables': 'les_miserables.jpg',
        'The Count of Monte Cristo': 'monte_cristo.jpg',
        'Madame Bovary': 'madame_bovary.jpg',
        'Candide': 'candide.jpg',
        'The Stranger': 'the_stranger.jpg',
        'Nausea': 'nausea.jpg',
        
        // Russian Books
        'Crime and Punishment': 'crime_punishment.jpg',
        'War and Peace': 'war-peace.jpg',
        'Anna Karenina': 'anna_karenina.jpg',
        'The Brothers Karamazov': 'brothers_karamazov.jpg',
        'Dead Souls': 'dead_souls.jpg',
        'Doctor Zhivago': 'doctor_zhivago.jpg',
        'The Master and Margarita': 'master_margarita.jpg',
        
        // Japanese Books
        'The Tale of Genji': 'tale_genji.jpg',
        'Kafka on the Shore': 'kafka_shore.jpg',
        'Snow Country': 'snow_country.jpg',
        'Kitchen': 'kitchen.jpg',
        'Battle Royale': 'battle_royale.jpg',
        'The Wind-Up Bird Chronicle': 'windup_bird.jpg',
        
        // Indian Books
        'Mahabharata': 'mahabharata.jpg',
        'The God of Small Things': 'god_small_things.jpg',
        "Midnight's Children": 'midnight-children.jpg',
        "Midnights Children": 'midnight-children.jpg',
        'A Suitable Boy': 'suitable_boy.jpg',
        'The White Tiger': 'white_tiger.jpg',
        'Sacred Games': 'sacred_games.jpg',
        'Shantaram': 'shantaram.jpg',
        
        // Brazilian Books
        'Dom Casmurro': 'dom_casmurro.jpg',
        'Gabriela, Clove and Cinnamon': 'gabriela.jpg',
        'Dona Flor and Her Two Husbands': 'dona_flor.jpg',
        'The Hour of the Star': 'hour_star.jpg',
        'City of God': 'city_god.jpg',
        
        // Nigerian Books
        'Things Fall Apart': 'things-fall-apart.jpg',
        'Half of a Yellow Sun': 'half-yellow-sun.jpg',
        'Americanah': 'americanah.jpg',
        'Purple Hibiscus': 'purple_hibiscus.jpg',
        
        // Chinese Books
        'Journey to the West': 'journey_west.jpg',
        'Dream of the Red Chamber': 'dream-red-chamber.jpg',
        'The Three-Body Problem': 'three_body.jpg',
        'Red Sorghum': 'red_sorghum.jpg',
        'Wild Swans': 'wild_swans.jpg',
        
        // Mexican Books
        'The Labyrinth of Solitude': 'labyrinth_solitude.jpg',
        'Pedro Páramo': 'pedro_paramo.jpg',
        'Like Water for Chocolate': 'like-water-chocolate.jpg',
        'Life Water for Chocolate': 'like-water-chocolate.jpg',
        'Under the Volcano': 'under_volcano.jpg',
        
        // Other popular books
        'The Alchemist': 'alchemist.jpg',
        'Alchemist': 'alchemist.jpg'
    };
    
    // First, check if we have a local image mapping
    if (book.title && imageMap[book.title]) {
        console.log(`Found image mapping for "${book.title}": ${imageMap[book.title]}`);
        return `images/covers/${imageMap[book.title]}`;
    }
    
    // Try partial matching for common book titles
    if (book.title) {
        const title = book.title.toLowerCase();
        if (title.includes('1984')) return 'images/covers/1984.jpg';
        if (title.includes('gatsby')) return 'images/covers/great-gatsby.jpg';
        if (title.includes('mockingbird')) return 'images/covers/mockingbird.jpg';
        if (title.includes('little prince')) return 'images/covers/little-prince.jpg';
        if (title.includes('alchemist')) return 'images/covers/alchemist.jpg';
        if (title.includes('pride') && title.includes('prejudice')) return 'images/covers/pride_prejudice.jpg';
        if (title.includes('harry potter')) return 'images/covers/harry-potter.jpg';
        if (title.includes('lord') && title.includes('rings')) return 'images/covers/lord_rings.jpg';
        if (title.includes('midnight') && title.includes('children')) return 'images/covers/midnight-children.jpg';
        if (title.includes('jane eyre')) return 'images/covers/jane_eyre.jpg';
        if (title.includes('wuthering heights')) return 'images/covers/wuthering_heights.jpg';
        if (title.includes('chronicles') && title.includes('narnia')) return 'images/covers/chronicles_narnia.jpg';
        if (title.includes('water') && title.includes('chocolate')) return 'images/covers/like-water-chocolate.jpg';
        if (title.includes('beloved')) return 'images/covers/beloved.jpg';
    }
    
    // Then check database cover_image_url
    if (book.cover_image_url) {
        // If it's a local path starting with 'images/', make it relative to the HTML file
        if (book.cover_image_url.startsWith('images/')) {
            return book.cover_image_url;
        }
        return book.cover_image_url;
    }
    
    // Generate placeholder with book title initial
    const initial = book.title ? encodeURIComponent(book.title.charAt(0).toUpperCase()) : 'B';
    const colors = ['8B1538', 'E91E63', '4A148C', '2E7D32', '1565C0', 'BF360C', 'F57C00'];
    const color = colors[(book.id || 0) % colors.length] || '8B1538';
    
    return `https://via.placeholder.com/300x400/${color}/ffffff?text=${initial}`;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
function handleError(error, userMessage = 'Something went wrong') {
    console.error('Error:', error);
    showToast(userMessage, 'error');
}

// Handle image loading errors
function handleImageError(img, initial) {
    img.onerror = null; // Prevent infinite loop
    const colors = ['8B1538', 'E91E63', '4A148C', '2E7D32', '1565C0', 'BF360C', 'F57C00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const encodedInitial = encodeURIComponent(initial || 'B');
    img.src = `https://via.placeholder.com/300x400/${color}/ffffff?text=${encodedInitial}`;
    img.style.opacity = '1';
}

// Force refresh images in recommendation section
function refreshBookImages() {
    const bookCards = document.querySelectorAll('.book-card img');
    bookCards.forEach(img => {
        const originalSrc = img.src;
        img.src = '';
        setTimeout(() => {
            img.src = originalSrc;
        }, 100);
    });
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);