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
                    // If verification fails, ensure we clear stored credentials
                    this.logout();
                }
            }

            // Update UI based on (possibly updated) auth state
            this.updateUI();

            // If still not authenticated, show auth modal (login) so the user
            // must either login or sign up before interacting.
            if (!this.isAuthenticated()) {
                openAuthModal('login');
            }
        })();
    }

    async verifyToken() {
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
            throw new Error('Token verification failed');
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
            userMenu.style.display = 'flex';
            userName.textContent = this.user.username;
            recLink.style.display = 'block';
            recSection.style.display = 'block';
            
            // Load recommendations
            loadRecommendations();
        } else {
            // Show auth buttons, hide user menu
            // We don't display login/signup buttons on the main page per design.
            // The auth modal will be shown on initial load instead.
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
            recLink.style.display = 'none';
            recSection.style.display = 'none';
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
                    window.location.href = 'app.html';
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
                    window.location.href = 'app.html';
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