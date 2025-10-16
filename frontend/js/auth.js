// Authentication Management
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('taletrail_token');
        this.user = null;
        this.init();
    }

    async init() {
        if (this.token) {
            try {
                await this.verifyToken();
            } catch (error) {
                console.error('Token verification failed:', error);
                this.logout();
            }
        }
        this.updateUI();
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
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            userName.textContent = this.user.username;
            recLink.style.display = 'block';
            recSection.style.display = 'block';
            
            // Load recommendations
            loadRecommendations();
        } else {
            // Show auth buttons, hide user menu
            loginBtn.style.display = 'inline-flex';
            signupBtn.style.display = 'inline-flex';
            userMenu.style.display = 'none';
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
    // Auth button listeners
    document.getElementById('login-btn').addEventListener('click', () => openAuthModal('login'));
    document.getElementById('signup-btn').addEventListener('click', () => openAuthModal('signup'));
    document.getElementById('logout-btn').addEventListener('click', () => authManager.logout());

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const success = await authManager.login(email, password);
        if (success) {
            closeAuthModal();
        }
    });

    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        const success = await authManager.signup(username, email, password);
        if (success) {
            closeAuthModal();
        }
    });

    // Close modal when clicking backdrop
    document.getElementById('auth-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });
});