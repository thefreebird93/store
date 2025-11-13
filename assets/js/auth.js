// Enhanced Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.setupAuthTabs();
        this.protectRoutes();
    }

    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('nonaBeautyUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateUI();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
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

    setupAuthTabs() {
        const authTabs = document.querySelectorAll('.auth-tab');
        if (authTabs.length > 0) {
            authTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    this.switchAuthTab(tabName);
                });
            });
        }
    }

    switchAuthTab(tabName) {
        // تحديث الألسنة النشطة
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');

        // إظهار النموذج المناسب
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tabName}Form`).classList.add('active');
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Basic validation
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!password) {
            this.showNotification('Please enter your password', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState('loginForm', true);

        // Check if user exists
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        setTimeout(() => {
            this.setLoadingState('loginForm', false);
            
            if (user) {
                this.login(user);
                this.showNotification('Login successful!', 'success');
                
                // Redirect based on user role
                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirect = urlParams.get('redirect');
                        window.location.href = redirect || 'index.html';
                    }
                }, 1000);
            } else {
                this.showNotification('Invalid email or password', 'error');
            }
        }, 1000);
    }

    handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
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

        if (!this.validatePhone(phone)) {
            this.showNotification('Please enter a valid phone number', 'error');
            return;
        }

        // Check if user already exists
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            this.showNotification('User with this email already exists', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState('registerForm', true);

        // Create new user
        setTimeout(() => {
            this.setLoadingState('registerForm', false);
            
            const newUser = {
                id: 'user_' + Date.now(),
                name,
                email,
                phone,
                password,
                role: 'customer',
                createdAt: new Date().toISOString(),
                addresses: [],
                preferences: {
                    newsletter: true,
                    productUpdates: true,
                    specialOffers: true
                }
            };

            // Save user
            users.push(newUser);
            localStorage.setItem('nonaBeautyUsers', JSON.stringify(users));

            // Auto login
            this.login(newUser);
            this.showNotification('Registration successful! Welcome to Nona Beauty!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    }

    handleLogout() {
        this.logout();
        this.showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    handleAdminLogout() {
        this.logout();
        this.showNotification('Admin logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    login(user) {
        this.currentUser = user;
        localStorage.setItem('nonaBeautyUser', JSON.stringify(user));
        this.updateUI();
        
        // Update main app if exists
        if (window.nonaBeautyApp) {
            window.nonaBeautyApp.currentUser = user;
            window.nonaBeautyApp.updateUI();
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('nonaBeautyUser');
        this.updateUI();
        
        // Update main app if exists
        if (window.nonaBeautyApp) {
            window.nonaBeautyApp.currentUser = null;
            window.nonaBeautyApp.updateUI();
        }
    }

    getUsers() {
        const users = localStorage.getItem('nonaBeautyUsers');
        return users ? JSON.parse(users) : this.getDefaultUsers();
    }

    getDefaultUsers() {
        return [
            {
                id: 'admin_1',
                name: 'Admin User',
                email: 'admin@nonabeauty.com',
                phone: '+1234567890',
                password: 'admin123',
                role: 'admin',
                createdAt: '2024-01-01T00:00:00.000Z',
                lastLogin: new Date().toISOString(),
                isActive: true,
                permissions: ['read', 'write', 'delete', 'admin']
            },
            {
                id: 'user_1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567891',
                password: 'password123',
                role: 'customer',
                createdAt: '2024-01-10T14:20:00.000Z',
                lastLogin: new Date().toISOString(),
                isActive: true,
                addresses: [
                    {
                        id: 'addr_1',
                        type: 'home',
                        firstName: 'John',
                        lastName: 'Doe',
                        street: '123 Main Street',
                        city: 'New York',
                        state: 'NY',
                        zipCode: '10001',
                        country: 'USA',
                        phone: '+1234567891',
                        isDefault: true
                    }
                ],
                preferences: {
                    newsletter: true,
                    productUpdates: true,
                    specialOffers: true
                }
            }
        ];
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
            if (userName) userName.textContent = this.currentUser.name.split(' ')[0];

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

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        return phoneRegex.test(phone);
    }

    setLoadingState(formId, isLoading) {
        const form = document.getElementById(formId);
        const submitBtn = form?.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            } else {
                submitBtn.disabled = false;
                if (formId === 'loginForm') {
                    submitBtn.innerHTML = 'Sign In';
                } else {
                    submitBtn.innerHTML = 'Create Account';
                }
            }
        }
    }

    protectRoutes() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Pages that require authentication
        const protectedPages = ['profile.html', 'admin.html'];
        
        if (protectedPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Admin pages require admin role
        if (currentPage === 'admin.html' && !this.isAdmin()) {
            window.location.href = 'index.html';
            return;
        }

        // Redirect authenticated users away from login page
        if (currentPage === 'login.html' && this.isAuthenticated()) {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location.href = redirect || 'index.html';
            return;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
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
            max-width: 400px;
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
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});
[file content end]
