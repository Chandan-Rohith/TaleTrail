// Book-related functionality
let currentBook = null;
let userRating = 0;

// Guard: only load books if authenticated
function canLoadBooks() {
    return window.authManager && authManager.isAuthenticated();
}

// User favorites cache
let userFavorites = new Set();
let favoritesLoaded = false;

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
            favoritesLoaded = true;
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoritesLoaded = true; // Set to true even on error to prevent blocking
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
                showToast('Added to favorites ', 'success');
                
                // Reload recommendations after adding favorites
                const recoContainer = document.getElementById('recommended-books');
                if (recoContainer) {
                    console.log('');
                    setTimeout(() => {
                        loadRecommendations();
                    }, 1000);
                }
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Failed to update favorites', 'error');
    }
}

// Create Book Card HTML
function createBookCard(book, isRecommended = false, isMLRecommendation = false) {
    // Ensure we have valid book data
    if (!book || !book.title) {
        console.warn('Invalid book data:', book);
        return '';
    }
    
    const rating = formatRating(book.average_rating || book.rating || 0);
    const coverUrl = getBookCoverUrl(book);
    const bookId = book.book_id || book.id;
    const isFavorited = userFavorites.has(bookId);
    
    // Determine classes based on recommendation type
    const cardClass = isMLRecommendation ? 'recommended-book ml-recommended' : (isRecommended ? 'recommended-book' : '');
    const titleClass = isMLRecommendation ? 'ml-recommended-title' : (isRecommended ? 'recommended-title' : '');
    const authorClass = isMLRecommendation ? 'ml-recommended-author' : (isRecommended ? 'recommended-author' : '');
    const badgeText = isMLRecommendation ? '<i class="fas fa-brain"></i> ML Recommended' : '<i class="fas fa-star"></i> Recommended';
    
    return `
        <div class="book-card ${cardClass}" onclick="openBookModal(${bookId})" style="position: relative;">
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
                ${(isRecommended || isMLRecommendation) ? `<div class="recommended-badge ${isMLRecommendation ? 'ml-badge' : ''}">${badgeText}</div>` : ''}
            </div>
            <div class="book-info">
                <div class="book-title-row">
                    <h3 class="book-title ${titleClass}">${book.title || 'Unknown Title'}</h3>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${bookId}, this)"
                            title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <p class="book-author ${authorClass}">by ${book.author || 'Unknown Author'}</p>
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
    if (!modal) {
        console.error('Book modal not found on this page');
        return;
    }
    
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

    if (!title || !cover || !author) {
        console.error('Required modal elements not found');
        return;
    }

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
        if (country) country.textContent = currentBook.country_name || 'Unknown';
        if (year) year.textContent = currentBook.publication_year || 'Unknown';
        if (description) description.textContent = currentBook.description || 'No description available.';
        
        const bookRating = formatRating(currentBook.average_rating);
        if (rating) rating.textContent = `${bookRating} (${currentBook.rating_count || 0} ratings)`;
        if (stars) stars.innerHTML = createStars(bookRating);
        
        // Show user rating section if authenticated
        if (userRatingSection && authManager.isAuthenticated()) {
            userRatingSection.style.display = 'block';
            setupRatingInput();
        } else if (userRatingSection) {
            userRatingSection.style.display = 'none';
        }
        
        // Display reviews
        if (reviews) {
            displayBookReviews(bookData.reviews || []);
        }
        
    } catch (error) {
        console.error('Error loading book details:', error);
        showToast('Failed to load book details', 'error');
        closeBookModal();
    }
}

// Close Book Modal
function closeBookModal() {
    const modal = document.getElementById('book-modal');
    if (!modal) return;
    
    modal.style.display = 'none';
    currentBook = null;
    userRating = 0;
    
    // Reset rating input
    const ratingStars = document.querySelectorAll('#rating-stars i');
    ratingStars.forEach(star => star.classList.remove('active'));
    
    const reviewText = document.getElementById('review-text');
    if (reviewText) {
        reviewText.value = '';
    }
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
let trendingBooksLoading = false;
async function loadTrendingBooks() {
    const container = document.getElementById('trending-books');
    
    if (!container) {
        // Silently return if container not found (e.g., on profile page)
        return;
    }
    
    // Prevent multiple simultaneous calls
    if (trendingBooksLoading) {
        console.log('⏳ Trending books already loading, skipping...');
        return;
    }
    
    trendingBooksLoading = true;
    
    // Wait for favorites to load if user is authenticated
    if (authManager.isAuthenticated() && !favoritesLoaded) {
        await loadUserFavorites();
    }
    
    try {
        showLoading('trending-books', 'Loading trending books...');
        
        const response = await apiService.getTrendingBooks(CONFIG.TRENDING_LIMIT);
        console.log('📊 Trending books response:', response);
        
        if (response && response.length > 0) {
            // Remove duplicates by book ID - check both id and book_id fields
            const uniqueBooks = [];
            const seenIds = new Set();
            
            response.forEach(book => {
                const bookId = book.id || book.book_id;
                if (bookId && !seenIds.has(bookId)) {
                    seenIds.add(bookId);
                    uniqueBooks.push(book);
                }
            });
            
            console.log('✅ Received:', response.length, 'books | After deduplication:', uniqueBooks.length, 'unique books');
            container.innerHTML = uniqueBooks.map(book => createBookCard(book)).join('');
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
    } finally {
        trendingBooksLoading = false;
    }
}

// Load ML-Based Recommendations ONLY (No Popular Books Fallback)
async function loadRecommendations() {
    const container = document.getElementById('recommended-books');
    const titleElement = document.getElementById('recommendations-title');
    const subtitleElement = document.getElementById('recommendations-subtitle');
    
    if (!container) {
        // Silently return if container not found (e.g., on profile page)
        return;
    }
    
    // Wait for favorites to load if user is authenticated
    if (authManager.isAuthenticated() && !favoritesLoaded) {
        await loadUserFavorites();
    }
    
    try {
        // Only show ML recommendations if user is authenticated
        if (!authManager.isAuthenticated() || !authManager.user || !authManager.user.id) {
            // User not logged in - show message to login
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-brain" style="font-size: 3rem; color: var(--forest); margin-bottom: 1rem;"></i>
                    <h3>🧠 AI-Powered Recommendations</h3>
                    <p style="margin-bottom: 1.5rem;">Login to get personalized book recommendations based on your favorites!</p>
                    <button onclick="showAuthModal()" class="cta-button" style="font-size: 1rem; padding: 0.75rem 1.5rem;">
                        <i class="fas fa-sign-in-alt"></i> Login to Get Recommendations
                    </button>
                </div>
            `;
            
            if (titleElement) {
                titleElement.textContent = '✨ AI-Powered Recommendations';
            }
            if (subtitleElement) {
                subtitleElement.textContent = 'Login to unlock personalized book recommendations';
            }
            
            return;
        }
        
        // User is logged in - fetch ML recommendations
        showLoading('recommended-books', 'Loading AI recommendations...');
        
        const mlResponse = await apiService.getUserRecommendations(
            authManager.user.id, 
            CONFIG.RECOMMENDATIONS_LIMIT
        );
        
        // Check if we got recommendations
        if (mlResponse.recommendations && mlResponse.recommendations.length > 0) {
            // Update title for ML recommendations
            if (titleElement) {
                titleElement.textContent = '✨ AI Recommended For You';
            }
            if (subtitleElement) {
                subtitleElement.textContent = 'Personalized recommendations powered by machine learning';
            }
            
            // Display ML recommendations with special styling
            container.innerHTML = mlResponse.recommendations.map(book => 
                createBookCard(book, true, true)  // isRecommended=true, isMLRecommendation=true
            ).join('');
            
            console.log('✅ Loaded ML recommendations:', mlResponse.recommendations.length, 'books');
        } else {
            // No recommendations available - user needs to add favorites
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-heart" style="font-size: 3rem; color: var(--burgundy); margin-bottom: 1rem;"></i>
                    <h3>No Recommendations Yet</h3>
                    <p style="margin-bottom: 1.5rem;">Add some books to your favorites to get personalized AI recommendations!</p>
                    <button onclick="window.location.href='app.html'" class="cta-button" style="font-size: 1rem; padding: 0.75rem 1.5rem;">
                        <i class="fas fa-book"></i> Browse Books
                    </button>
                </div>
            `;
            
            if (titleElement) {
                titleElement.textContent = '✨ AI Recommendations';
            }
            if (subtitleElement) {
                subtitleElement.textContent = 'Add favorites to get personalized recommendations';
            }
            
            console.log('⚠️ No ML recommendations - user needs to add favorites');
        }
        
    } catch (error) {
        console.error('❌ Error loading ML recommendations:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626; margin-bottom: 1rem;"></i>
                <h3>Failed to Load Recommendations</h3>
                <p>Please try again later or contact support if the issue persists.</p>
            </div>
        `;
        
        if (titleElement) {
            titleElement.textContent = '✨ AI Recommendations';
        }
        if (subtitleElement) {
            subtitleElement.textContent = 'Something went wrong';
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for auth to be ready, then load favorites
    if (authManager && authManager.ready) {
        await authManager.ready;
        if (authManager.isAuthenticated()) {
            await loadUserFavorites();
            console.log('✅ User favorites loaded:', userFavorites.size, 'books');
        }
    }
    
    // Load trending books on page load (only if container exists)
    // AWAIT this to ensure favorites are set before rendering
    if (document.getElementById('trending-books')) {
        await loadTrendingBooks();
    }
    
    // Load recommendations if on main page
    // AWAIT this to ensure proper sequencing
    if (document.getElementById('recommended-books')) {
        await loadRecommendations();
    }
    
    // Close modal when clicking backdrop
    const bookModal = document.getElementById('book-modal');
    if (bookModal) {
        bookModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBookModal();
            }
        });
    }
    
    // Handle escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const bookModal = document.getElementById('book-modal');
            const authModal = document.getElementById('auth-modal');
            
            if (bookModal && bookModal.style.display === 'flex') {
                closeBookModal();
            } else if (authModal && authModal.style.display === 'flex') {
                closeAuthModal();
            }
        }
    });
});