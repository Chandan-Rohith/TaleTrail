// Main Application Logic
class TaleTrailApp {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupSearchFeatures();
        this.checkInitialAuth();
    }

    setupNavigation() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.navigateToSection(sectionId);
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    navigateToSection(sectionId) {
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
        
        // Scroll to section
        scrollToSection(sectionId);
        this.currentSection = sectionId;
    }

    updateActiveNavLink() {
        const sections = ['home', 'explore', 'trending', 'recommendations'];
        const scrollPosition = window.scrollY + 100;
        
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    if (this.currentSection !== sectionId) {
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                        });
                        
                        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                        
                        this.currentSection = sectionId;
                    }
                    break;
                }
            }
        }
    }

    setupScrollEffects() {
        // Smooth reveal animations for sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const parallaxSpeed = 0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    setupSearchFeatures() {
        // Advanced search functionality could be added here
        // For now, we'll add a simple search that filters visible books
        this.createSearchOverlay();
    }

    createSearchOverlay() {
        // Create search button in navigation
        const searchBtn = document.createElement('button');
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.className = 'btn-secondary';
        searchBtn.style.marginLeft = '1rem';
        searchBtn.onclick = () => this.openSearchOverlay();
        
        const navAuth = document.querySelector('.nav-auth');
        navAuth.insertBefore(searchBtn, navAuth.firstChild);
    }

    openSearchOverlay() {
        // Create and show search overlay
        const overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.className = 'modal-backdrop';
        overlay.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>🔍 Search Books</h2>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <input type="text" id="search-input" placeholder="Search by title, author, or country..." style="width: 100%; padding: 15px; font-size: 1.1rem; border: 2px solid var(--cream-dark); border-radius: 10px;">
                    </div>
                    <div id="search-results" style="max-height: 400px; overflow-y: auto; margin-top: 1rem;">
                        <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <p>Start typing to search for books...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Focus on search input
        const searchInput = document.getElementById('search-input');
        searchInput.focus();
        
        // Setup search functionality
        const debouncedSearch = debounce(this.performSearch.bind(this), 300);
        searchInput.addEventListener('input', debouncedSearch);
        
        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    async performSearch(event) {
        const query = event.target.value.trim();
        const resultsContainer = document.getElementById('search-results');
        
        if (query.length < 2) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Start typing to search for books...</p>
                </div>
            `;
            return;
        }
        
        try {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-spinner spin" style="font-size: 2rem; color: var(--golden); margin-bottom: 1rem;"></i>
                    <p>Searching...</p>
                </div>
            `;
            
            const response = await apiService.getBooks({ 
                search: query, 
                limit: 20 
            });
            
            if (response.books && response.books.length > 0) {
                resultsContainer.innerHTML = `
                    <div style="display: grid; gap: 1rem;">
                        ${response.books.map(book => `
                            <div class="search-result-item" onclick="document.getElementById('search-overlay').remove(); openBookModal(${book.id});" style="display: flex; gap: 1rem; padding: 1rem; background: var(--cream-light); border-radius: 10px; cursor: pointer; transition: background 0.3s ease;">
                                <img src="${getBookCoverUrl(book)}" alt="${book.title}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 5px;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 0.5rem 0; color: var(--burgundy);">${book.title}</h4>
                                    <p style="margin: 0 0 0.5rem 0; color: var(--text-gray); font-style: italic;">by ${book.author}</p>
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <div class="stars">${createStars(book.average_rating)}</div>
                                        <span style="color: var(--forest); font-size: 0.9rem;">
                                            <i class="fas fa-globe"></i> ${book.country_name || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                // Add hover effects
                const resultItems = resultsContainer.querySelectorAll('.search-result-item');
                resultItems.forEach(item => {
                    item.addEventListener('mouseenter', () => {
                        item.style.background = 'white';
                        item.style.transform = 'translateY(-2px)';
                        item.style.boxShadow = 'var(--shadow-warm)';
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.background = 'var(--cream-light)';
                        item.style.transform = 'translateY(0)';
                        item.style.boxShadow = 'none';
                    });
                });
                
            } else {
                resultsContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                        <i class="fas fa-book-dead" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>No books found for "${query}"</p>
                        <p style="font-size: 0.9rem;">Try a different search term.</p>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #dc2626;"></i>
                    <p>Search failed</p>
                    <p style="font-size: 0.9rem;">Please try again.</p>
                </div>
            `;
        }
    }

    async checkInitialAuth() {
        // Check if user is logged in and update UI accordingly
        if (authManager.isAuthenticated()) {
            // Load user-specific content
            setTimeout(() => {
                loadRecommendations();
            }, 1000);
        }
    }

    // Statistics and Analytics
    async loadUserStats() {
        if (!authManager.isAuthenticated()) return;
        
        try {
            const stats = await apiService.getUserStats();
            this.displayUserStats(stats);
        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    }

    displayUserStats(stats) {
        // Create a stats widget that could be shown in user menu
        const statsHTML = `
            <div class="user-stats" style="background: var(--cream-light); padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                <h4 style="color: var(--burgundy); margin-bottom: 0.5rem;">📊 Your Reading Stats</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.9rem;">
                    <div>📚 Books Rated: <strong>${stats.books_rated}</strong></div>
                    <div>⭐ Avg Rating: <strong>${stats.average_rating_given}</strong></div>
                    <div>🌍 Countries: <strong>${stats.countries_explored}</strong></div>
                    <div>🎯 Activity: <strong>${stats.favorite_interaction}</strong></div>
                </div>
            </div>
        `;
        
        // This could be added to a user profile modal or dashboard
        console.log('User stats loaded:', stats);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for auth verification to finish before fully initializing the app.
    // This prevents a brief flash of the auth modal when a stored token is being verified.
    if (window.authReady) {
        try {
            await window.authReady;
        } catch (e) {
            // If auth verification failed, we've already logged out in authManager;
            // proceed with app initialization anyway.
            console.warn('auth verification failed or was rejected', e);
        }
    }

    window.taleTrailApp = new TaleTrailApp();
    
    // Add some interactive flourishes
    addInteractiveFlourishes();
});

function addInteractiveFlourishes() {
    // Add particle effect to hero section
    createFloatingParticles();
    
    // Add reading progress indicator
    createReadingProgress();
    
    // Add theme customization (optional)
    addThemeCustomization();
}

function createFloatingParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create subtle floating book icons
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            opacity: 0.1;
            pointer-events: none;
            z-index: 1;
            animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            color: var(--golden);
            font-size: 20px;
        `;
        particle.innerHTML = ['📚', '📖', '📝', '✒️', '🖋️'][i];
        hero.appendChild(particle);
    }
}

function createReadingProgress() {
    // Create a reading progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--burgundy), var(--golden), var(--forest));
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    });
}

function addThemeCustomization() {
    // Theme customization removed - using single consistent theme
    // This function is kept empty for backwards compatibility
}