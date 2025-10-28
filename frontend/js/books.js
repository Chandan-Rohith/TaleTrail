// Book-related functionality
let currentBook = null;
let userRating = 0;

// Guard: only load books if authenticated
function canLoadBooks() {
    return window.authManager && authManager.isAuthenticated();
}

// User favorites cache
let userFavorites = new Set();

// Load user favorites
async function loadUserFavorites() {
    if (!authManager.isAuthenticated()) return;
    
    try {
        const token = authManager.getToken();
        const response = await fetch(`${CONFIG.API_BASE_URL}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            userFavorites = new Set(data.favorites.map(f => f.book_id));
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

// Toggle favorite status
async function toggleFavorite(bookId, button) {
    if (!authManager.isAuthenticated()) {
        showToast('Please login to save books', 'warning');
        return;
    }
    
    const token = authManager.getToken();
    const isFavorited = userFavorites.has(bookId);
    const method = isFavorited ? 'DELETE' : 'POST';
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/favorites/${bookId}`, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            if (isFavorited) {
                userFavorites.delete(bookId);
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.classList.remove('favorited');
                showToast('Removed from favorites', 'success');
            } else {
                userFavorites.add(bookId);
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.classList.add('favorited');
                showToast('Added to favorites', 'success');
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Failed to update favorites', 'error');
    }
}

// Create Book Card HTML
function createBookCard(book) {
    // Ensure we have valid book data
    if (!book || !book.title) {
        console.warn('Invalid book data:', book);
        return '';
    }
    
    const rating = formatRating(book.average_rating || book.rating || 0);
    const coverUrl = getBookCoverUrl(book);
    const bookId = book.book_id || book.id;
    const isFavorited = userFavorites.has(bookId);
    
    return `
        <div class="book-card" onclick="openBookModal(${bookId})" style="position: relative;">
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                    onclick="event.stopPropagation(); toggleFavorite(${bookId}, this)"
                    title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <div class="book-cover-container">
                <img src="${coverUrl}" alt="${book.title}" class="book-cover" 
                     onerror="handleImageError(this, '${book.title.charAt(0).toUpperCase()}');"
                     onload="this.style.opacity='1';"
                     style="opacity: 0; transition: opacity 0.3s ease;"
                     loading="lazy">
                <div class="book-rating-overlay">
                    <div class="stars">
                        ${createStars(rating)}
                    </div>
                    <span>${rating}</span>
                </div>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title || 'Unknown Title'}</h3>
                <p class="book-author">by ${book.author || 'Unknown Author'}</p>
                <p class="book-country">
                    <i class="fas fa-globe"></i>
                    ${book.country || book.country_name || 'Unknown'}
                </p>
                <div class="book-description">
                    ${truncateText(book.description || 'No description available.')}
                </div>
            </div>
        </div>
    `;
}

// Open Book Detail Modal
async function openBookModal(bookId) {
    const modal = document.getElementById('book-modal');
    const title = document.getElementById('modal-book-title');
    const cover = document.getElementById('modal-book-cover');
    const author = document.getElementById('modal-book-author');
    const country = document.getElementById('modal-book-country');
    const year = document.getElementById('modal-book-year');
    const description = document.getElementById('modal-book-description');
    const rating = document.getElementById('modal-book-rating');
    const stars = document.getElementById('modal-book-stars');
    const reviews = document.getElementById('book-reviews');
    const userRatingSection = document.getElementById('user-rating-section');

    try {
        // Show modal with loading state
        modal.style.display = 'flex';
        title.textContent = 'Loading...';
        
        // Fetch book details
        const bookData = await apiService.getBook(bookId);
        currentBook = bookData.book;
        
        // Populate modal with book data
        title.textContent = currentBook.title;
        cover.src = getBookCoverUrl(currentBook);
        cover.alt = currentBook.title;
        author.textContent = currentBook.author;
        country.textContent = currentBook.country_name || 'Unknown';
        year.textContent = currentBook.publication_year || 'Unknown';
        description.textContent = currentBook.description || 'No description available.';
        
        const bookRating = formatRating(currentBook.average_rating);
        rating.textContent = `${bookRating} (${currentBook.rating_count || 0} ratings)`;
        stars.innerHTML = createStars(bookRating);
        
        // Show user rating section if authenticated
        if (authManager.isAuthenticated()) {
            userRatingSection.style.display = 'block';
            setupRatingInput();
        } else {
            userRatingSection.style.display = 'none';
        }
        
        // Display reviews
        displayBookReviews(bookData.reviews || []);
        
    } catch (error) {
        console.error('Error loading book details:', error);
        showToast('Failed to load book details', 'error');
        closeBookModal();
    }
}

// Close Book Modal
function closeBookModal() {
    document.getElementById('book-modal').style.display = 'none';
    currentBook = null;
    userRating = 0;
    
    // Reset rating input
    const ratingStars = document.querySelectorAll('#rating-stars i');
    ratingStars.forEach(star => star.classList.remove('active'));
    document.getElementById('review-text').value = '';
}

// Setup Rating Input
function setupRatingInput() {
    const ratingStars = document.querySelectorAll('#rating-stars i');
    
    ratingStars.forEach((star, index) => {
        const rating = index + 1;
        
        star.addEventListener('mouseenter', () => {
            highlightStars(rating);
        });
        
        star.addEventListener('mouseleave', () => {
            highlightStars(userRating);
        });
        
        star.addEventListener('click', () => {
            userRating = rating;
            highlightStars(rating);
        });
    });
}

function highlightStars(rating) {
    const ratingStars = document.querySelectorAll('#rating-stars i');
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit Rating
async function submitRating() {
    if (!authManager.isAuthenticated()) {
        showToast('Please login to rate books', 'warning');
        return;
    }
    
    if (!currentBook || userRating === 0) {
        showToast('Please select a rating', 'warning');
        return;
    }
    
    try {
        const reviewText = document.getElementById('review-text').value.trim();
        
        await apiService.rateBook(currentBook.id, userRating, reviewText);
        
        showToast('Rating submitted successfully! 🌟', 'success');
        
        // Refresh book data to show updated rating
        setTimeout(() => {
            openBookModal(currentBook.id);
        }, 1000);
        
    } catch (error) {
        console.error('Error submitting rating:', error);
        showToast('Failed to submit rating', 'error');
    }
}

// Display Book Reviews
function displayBookReviews(reviews) {
    const reviewsContainer = document.getElementById('book-reviews');
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                <i class="fas fa-comment-alt" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No reviews yet. Be the first to review this book!</p>
            </div>
        `;
        return;
    }
    
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.username}</span>
                <div class="review-rating">
                    ${createStars(review.rating)}
                </div>
            </div>
            ${review.review_text ? `<p class="review-text">${review.review_text}</p>` : ''}
            <small style="color: var(--text-gray); font-style: italic;">
                ${new Date(review.created_at).toLocaleDateString()}
            </small>
        </div>
    `).join('');
}

// Load Trending Books
async function loadTrendingBooks() {
    const container = document.getElementById('trending-books');
    
    try {
        showLoading('trending-books', 'Loading trending books...');
        
        const response = await apiService.getTrendingBooks(CONFIG.TRENDING_LIMIT);
        
        if (response && response.length > 0) {
            container.innerHTML = response.map(book => createBookCard(book)).join('');
        } else {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-fire" style="font-size: 3rem; color: var(--golden); margin-bottom: 1rem;"></i>
                    <h3>No trending books right now</h3>
                    <p>Check back later for the latest popular reads!</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading trending books:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626; margin-bottom: 1rem;"></i>
                <h3>Failed to load trending books</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Load User Recommendations
async function loadRecommendations() {
    const container = document.getElementById('recommended-books');
    
    if (!authManager.isAuthenticated()) {
        // Show popular books for non-authenticated users
        try {
            showLoading('recommended-books', 'Loading popular recommendations...');
            
            const response = await apiService.getBooks({ 
                sort: 'rating', 
                order: 'desc', 
                limit: CONFIG.RECOMMENDATIONS_LIMIT 
            });
            
            if (response.books && response.books.length > 0) {
                container.innerHTML = response.books.map(book => createBookCard(book)).join('');
                
                // Add "Popular" badges instead of "Recommended"
                const cards = container.querySelectorAll('.book-card');
                cards.forEach((card, index) => {
                    const badge = document.createElement('div');
                    badge.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: var(--golden);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        z-index: 10;
                    `;
                    badge.innerHTML = `<i class="fas fa-star"></i> Popular`;
                    card.style.position = 'relative';
                    card.appendChild(badge);
                });
            }
        } catch (error) {
            console.error('Error loading popular books:', error);
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-book" style="font-size: 3rem; color: var(--golden); margin-bottom: 1rem;"></i>
                    <h3>Popular Recommendations</h3>
                    <p>Login to get personalized recommendations!</p>
                    <button class="btn-primary" onclick="document.getElementById('auth-modal').style.display='flex'" style="margin-top: 1rem;">
                        <i class="fas fa-sign-in-alt"></i> Login for Personal Recommendations
                    </button>
                </div>
            `;
        }
        return;
    }
    
    try {
        showLoading('recommended-books', 'Generating personalized recommendations...');
        
        const response = await apiService.getUserRecommendations(
            authManager.user.id, 
            CONFIG.RECOMMENDATIONS_LIMIT
        );
        
        if (response.recommendations && response.recommendations.length > 0) {
            container.innerHTML = response.recommendations.map(book => createBookCard(book)).join('');
            
            // Add recommendation badges
            const cards = container.querySelectorAll('.book-card');
            cards.forEach((card, index) => {
                const badge = document.createElement('div');
                badge.style.cssText = `
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: var(--forest);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 10;
                `;
                badge.innerHTML = `<i class="fas fa-magic"></i> Recommended`;
                card.style.position = 'relative';
                card.appendChild(badge);
            });
            
        } else {
            // Fall back to popular books if no personalized recommendations
            const fallbackResponse = await apiService.getBooks({ 
                sort: 'rating', 
                order: 'desc', 
                limit: CONFIG.RECOMMENDATIONS_LIMIT 
            });
            
            if (fallbackResponse.books && fallbackResponse.books.length > 0) {
                container.innerHTML = fallbackResponse.books.map(book => createBookCard(book)).join('');
                
                // Add "Popular" badges
                const cards = container.querySelectorAll('.book-card');
                cards.forEach((card, index) => {
                    const badge = document.createElement('div');
                    badge.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: var(--golden);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        z-index: 10;
                    `;
                    badge.innerHTML = `<i class="fas fa-star"></i> Popular`;
                    card.style.position = 'relative';
                    card.appendChild(badge);
                });
                
                // Show message about rating books
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 2rem;
                    background: var(--card-bg);
                    border-radius: 15px;
                    margin-bottom: 2rem;
                    border: 2px dashed var(--forest);
                `;
                messageDiv.innerHTML = `
                    <i class="fas fa-magic" style="font-size: 2rem; color: var(--forest); margin-bottom: 1rem;"></i>
                    <h3>Building Your Personal Recommendations</h3>
                    <p>Rate some books below to get AI-powered personalized recommendations!</p>
                `;
                container.insertBefore(messageDiv, container.firstChild);
            } else {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <i class="fas fa-magic" style="font-size: 3rem; color: var(--forest); margin-bottom: 1rem;"></i>
                        <h3>Building your recommendations</h3>
                        <p>Rate some books to get personalized recommendations!</p>
                        <button class="btn-primary" onclick="scrollToSection('trending')" style="margin-top: 1rem;">
                            <i class="fas fa-star"></i> Discover Books to Rate
                        </button>
                    </div>
                `;
            }
        }
        
    } catch (error) {
        console.error('Error loading recommendations:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-robot" style="font-size: 3rem; color: var(--golden); margin-bottom: 1rem;"></i>
                <h3>Recommendations temporarily unavailable</h3>
                <p>Our AI is taking a coffee break. Try the trending books instead!</p>
                <button class="btn-secondary" onclick="scrollToSection('trending')" style="margin-top: 1rem;">
                    <i class="fas fa-fire"></i> View Trending Books
                </button>
            </div>
        `;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load trending books on page load
    loadTrendingBooks();
    
    // Close modal when clicking backdrop
    document.getElementById('book-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBookModal();
        }
    });
    
    // Handle escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const bookModal = document.getElementById('book-modal');
            const authModal = document.getElementById('auth-modal');
            
            if (bookModal.style.display === 'flex') {
                closeBookModal();
            } else if (authModal.style.display === 'flex') {
                closeAuthModal();
            }
        }
    });
});