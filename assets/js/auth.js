class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('nonaBeautyUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Admin logout
        const adminLogoutBtn = document.getElementById('adminLogout');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAdminLogout();
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Basic validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Check if user exists
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.login(user);
            
            // Redirect based on user role
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const address = document.getElementById('registerAddress').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validation
        if (!name || !email || !phone || !address || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        // Check if user already exists
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            this.showNotification('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            address,
            password,
            role: 'customer',
            createdAt: new Date().toISOString(),
            addresses: [
                {
                    id: '1',
                    type: 'home',
                    address: address,
                    isDefault: true
                }
            ]
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('nonaBeautyUsers', JSON.stringify(users));

        // Auto login
        this.login(newUser);
        this.showNotification('Registration successful!', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    handleLogout() {
        this.logout();
        window.location.href = 'index.html';
    }

    handleAdminLogout() {
        this.logout();
        window.location.href = 'login.html';
    }

    login(user) {
        this.currentUser = user;
        localStorage.setItem('nonaBeautyUser', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('nonaBeautyUser');
        this.updateUI();
    }

    getUsers() {
        const users = localStorage.getItem('nonaBeautyUsers');
        return users ? JSON.parse(users) : [];
    }

    updateUI() {
        // Update navigation based on login status
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.name;

            // Show admin link if user is admin
            const adminLink = document.getElementById('adminLink');
            if (adminLink) {
                adminLink.style.display = this.currentUser.role === 'admin' ? 'block' : 'none';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles if not already in CSS
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#d63384'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Protect admin routes
    protectAdminRoutes() {
        if (!this.isAuthenticated() || !this.isAdmin()) {
            window.location.href = 'login.html';
        }
    }

    // Protect user routes
    protectUserRoutes() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();

    // Protect admin pages
    if (window.location.pathname.includes('admin.html')) {
        authManager.protectAdminRoutes();
    }

    // Protect profile pages
    if (window.location.pathname.includes('profile.html')) {
        authManager.protectUserRoutes();
    }
});
