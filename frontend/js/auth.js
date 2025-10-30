// Authentication Management
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('taletrail_token');
        this.user = null;
        // Promise that resolves when initial auth verification completes.
        this.ready = null;
        this.init();
    }

    async init() {
        // Create a readiness promise so other modules (like main.js) can wait
        // for auth verification to complete before rendering UI, preventing
        // a brief flash of the auth modal when a valid token exists.
        this.ready = (async () => {
            if (this.token) {
                try {
                    await this.verifyToken();
                } catch (error) {
                    console.error('Token verification failed:', error);
                    // Only logout if it's not a network error
                    if (!error.message.includes('Network error')) {
                        // If verification fails due to invalid token, clear stored credentials
                        this.logout();
                    } else {
                        console.warn('Network error - keeping existing token');
                    }
                }
            }

            // Update UI based on (possibly updated) auth state
            this.updateUI();
        })();
    }

    async verifyToken() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                return true;
            } else {
                console.error('Token verification failed with status:', response.status);
                throw new Error('Token verification failed');
            }
        } catch (error) {
            // Check if it's a network/CORS error
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                console.error('Network error during token verification:', error);
                // Don't logout on network errors - keep the token
                throw new Error('Network error - unable to verify token');
            }
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('taletrail_token', this.token);
                this.updateUI();
                showToast('Welcome back! 📚', 'success');
                return true;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    }

    async signup(username, email, password) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('taletrail_token', this.token);
                this.updateUI();
                showToast('Account created successfully! Welcome to TaleTrail! 🎉', 'success');
                return true;
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('taletrail_token');
        this.updateUI();
        showToast('Logged out successfully', 'success');
    }

    getToken() {
        return this.token;
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        const recLink = document.getElementById('rec-link');
        const recSection = document.getElementById('recommendations');

        if (this.isAuthenticated()) {
            // Show user menu, hide auth buttons
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = this.user.username;
            if (recLink) recLink.style.display = 'block';
            if (recSection) recSection.style.display = 'block';
            
            // Load recommendations if function exists
            if (typeof loadRecommendations === 'function') {
                loadRecommendations();
            }
        } else {
            // Show auth buttons, hide user menu
            // We don't display login/signup buttons on the main page per design.
            // The auth modal will be shown on initial load instead.
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
            if (recLink) recLink.style.display = 'none';
            if (recSection) recSection.style.display = 'none';
        }
    }

    isAuthenticated() {
        return this.token && this.user;
    }

    getAuthHeaders() {
        if (this.token) {
            return {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Expose a global promise that indicates when initial auth verification has completed.
// Other parts of the app can await `window.authReady` to avoid UI flashes.
window.authReady = authManager.ready;

// Simple localStorage-based redirect to enforce landing/login/main flow quickly.
// This checks the presence of a token in localStorage and redirects without
// waiting for async verification so pages don't flash incorrect content.
function checkLocalAuthRedirect() {
    try {
        const token = localStorage.getItem('taletrail_token');
        const path = window.location.pathname;
        let file = path.substring(path.lastIndexOf('/') + 1);
        if (!file) file = 'index.html';

        // If user is on landing and has token -> go to main
        if (file === 'index.html' || file === '') {
            if (token) {
                window.location.href = 'main.html';
                return;
            }
        }

        // If user is on login page and already logged in -> go to main
        if (file === 'login.html') {
            if (token) {
                window.location.href = 'main.html';
                return;
            }
        }

        // If user is on main page but not logged in -> go to landing
        if (file === 'main.html' || file === 'app.html') {
            if (!token) {
                window.location.href = 'index.html';
                return;
            }
        }
    } catch (err) {
        // ignore and allow normal flow
        console.warn('Auth redirect check failed:', err);
    }
}

// Run redirect check as early as possible
checkLocalAuthRedirect();

// Auth Modal Functions
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-modal-title');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (mode === 'login') {
        title.textContent = 'Login to TaleTrail';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        title.textContent = 'Join TaleTrail';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }

    modal.style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
    // Reset forms
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
}

function switchToSignup() {
    openAuthModal('signup');
}

function switchToLogin() {
    openAuthModal('login');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Safely attach auth-related listeners only if the elements exist on the page
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authModal = document.getElementById('auth-modal');

    if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));
    if (signupBtn) signupBtn.addEventListener('click', () => openAuthModal('signup'));
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        authManager.logout();
        // After logout, redirect to landing
        window.location.href = 'index.html';
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const success = await authManager.login(email, password);
            if (success) {
                // If this form exists on a dedicated login page, redirect to the app
                if (window.location.pathname.endsWith('login.html')) {
                    window.location.href = 'main.html';
                } else {
                    closeAuthModal();
                }
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            const success = await authManager.signup(username, email, password);
            if (success) {
                if (window.location.pathname.endsWith('login.html')) {
                    window.location.href = 'main.html';
                } else {
                    closeAuthModal();
                }
            }
        });
    }

    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });
    }
});