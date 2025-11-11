// Authentication Management Class
class AuthManager {
    constructor(app) {
        this.app = app;
        this.utils = app.utils;
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.loadUser();
        this.initAuthModal();
    }

    loadUser() {
        const userData = this.utils.getStorage('user');
        if (userData && this.validateUserToken(userData)) {
            this.currentUser = userData;
            this.isLoggedIn = true;
            this.app.currentUser = userData;
        }
    }

    validateUserToken(user) {
        // In real app, validate JWT token or session
        return user && user.email && user.name;
    }

    initAuthModal() {
        // Create auth modal content
        const authModalContent = `
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">
                    ${this.app.translate('login')}
                </button>
                <button class="auth-tab" data-tab="register">
                    ${this.app.translate('register')}
                </button>
            </div>

            <form class="auth-form active" id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">${this.app.translate('email')}</label>
                    <input type="email" id="loginEmail" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="loginPassword">${this.app.translate('password')}</label>
                    <input type="password" id="loginPassword" class="form-control" required>
                </div>

                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" id="rememberMe">
                        <span class="checkmark"></span>
                        ${this.app.translate('rememberMe')}
                    </label>
                    <a href="#" class="forgot-password">${this.app.translate('forgotPassword')}</a>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    ${this.app.translate('login')}
                </button>
            </form>

            <form class="auth-form" id="registerForm">
                <div class="form-group">
                    <label for="registerName">${this.app.translate('fullName')}</label>
                    <input type="text" id="registerName" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="registerEmail">${this.app.translate('email')}</label>
                    <input type="email" id="registerEmail" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="registerPhone">${this.app.translate('phone')}</label>
                    <input type="tel" id="registerPhone" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="registerAddress">${this.app.translate('shippingAddress')}</label>
                    <textarea id="registerAddress" class="form-control" required></textarea>
                </div>

                <div class="form-group">
                    <label for="registerPassword">${this.app.translate('password')}</label>
                    <input type="password" id="registerPassword" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="registerConfirmPassword">${this.app.translate('confirmPassword')}</label>
                    <input type="password" id="registerConfirmPassword" class="form-control" required>
                </div>

                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" id="acceptTerms" required>
                        <span class="checkmark"></span>
                        ${this.app.translate('acceptTerms')}
                    </label>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    ${this.app.translate('register')}
                </button>
            </form>
        `;

        this.utils.$('#authModalContent').innerHTML = authModalContent;
        this.bindAuthEvents();
    }

    bindAuthEvents() {
        // Tab switching
        this.utils.$$('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.dataset.tab);
            });
        });

        // Form submissions
        this.utils.$('#loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.utils.$('#registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Forgot password
        this.utils.$('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPassword();
        });
    }

    switchAuthTab(tab) {
        // Update active tab
        this.utils.$$('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        // Show active form
        this.utils.$$('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tab}Form`);
        });
    }

    async handleLogin() {
        const email = this.utils.$('#loginEmail').value;
        const password = this.utils.$('#loginPassword').value;
        const rememberMe = this.utils.$('#rememberMe').checked;

        if (!this.validateEmail(email)) {
            this.app.showNotification('البريد الإلكتروني غير صحيح', 'error');
            return;
        }

        if (password.length < 6) {
            this.app.showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        try {
            this.showAuthLoading();

            const user = await this.authenticate({ email, password });

            if (user) {
                this.login(user, rememberMe);
                this.closeAuthModal();
                this.app.showNotification('تم تسجيل الدخول بنجاح', 'success');
            } else {
                this.app.showNotification('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
            }
        } catch (error) {
            this.app.showNotification('حدث خطأ في تسجيل الدخول', 'error');
            console.error('Login error:', error);
        } finally {
            this.hideAuthLoading();
        }
    }

    async handleRegister() {
        const formData = {
            name: this.utils.$('#registerName').value,
            email: this.utils.$('#registerEmail').value,
            phone: this.utils.$('#registerPhone').value,
            address: this.utils.$('#registerAddress').value,
            password: this.utils.$('#registerPassword').value,
            confirmPassword: this.utils.$('#registerConfirmPassword').value
        };

        // Validation
        const validation = this.validateRegistration(formData);
        if (!validation.isValid) {
            this.app.showNotification(validation.message, 'error');
            return;
        }

        if (!this.utils.$('#acceptTerms').checked) {
            this.app.showNotification('يجب الموافقة على الشروط والأحكام', 'error');
            return;
        }

        try {
            this.showAuthLoading();

            const user = await this.register(formData);

            if (user) {
                this.login(user, true);
                this.closeAuthModal();
                this.app.showNotification('تم إنشاء الحساب بنجاح', 'success');
            }
        } catch (error) {
            this.app.showNotification('حدث خطأ في إنشاء الحساب', 'error');
            console.error('Registration error:', error);
        } finally {
            this.hideAuthLoading();
        }
    }

    validateRegistration(formData) {
        if (!formData.name || formData.name.length < 2) {
            return { isValid: false, message: 'الاسم يجب أن يكون على الأقل حرفين' };
        }

        if (!this.validateEmail(formData.email)) {
            return { isValid: false, message: 'البريد الإلكتروني غير صحيح' };
        }

        if (!this.utils.validatePhone(formData.phone)) {
            return { isValid: false, message: 'رقم الهاتف غير صحيح' };
        }

        if (!formData.address || formData.address.length < 10) {
            return { isValid: false, message: 'العنوان يجب أن يكون على الأقل 10 أحرف' };
        }

        if (formData.password.length < 6) {
            return { isValid: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
        }

        if (formData.password !== formData.confirmPassword) {
            return { isValid: false, message: 'كلمات المرور غير متطابقة' };
        }

        return { isValid: true };
    }

    validateEmail(email) {
        return this.utils.validateEmail(email);
    }

    async authenticate(credentials) {
        // Mock authentication - in real app, call your API
        return new Promise((resolve) => {
            setTimeout(() => {
                // Default admin user
                if (credentials.email === 'admin@nonabeauty.com' && credentials.password === '123456') {
                    resolve({
                        id: 1,
                        name: 'مدير النظام',
                        email: credentials.email,
                        phone: '01094004720',
                        address: 'الإدارة',
                        isAdmin: true,
                        createdAt: new Date().toISOString()
                    });
                }
                // Regular user
                else if (credentials.email === 'user@example.com' && credentials.password === '123456') {
                    resolve({
                        id: 2,
                        name: 'مستخدم تجريبي',
                        email: credentials.email,
                        phone: '01000000000',
                        address: 'عنوان تجريبي',
                        isAdmin: false,
                        createdAt: new Date().toISOString()
                    });
                } else {
                    resolve(null);
                }
            }, 1500);
        });
    }

    async register(userData) {
        // Mock registration - in real app, call your API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    isAdmin: false,
                    createdAt: new Date().toISOString()
                });
            }, 2000);
        });
    }

    login(user, rememberMe = true) {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.app.currentUser = user;

        // Save user data
        if (rememberMe) {
            this.utils.setStorage('user', user);
        }

        // Update UI
        this.app.updateUserUI();

        // Dispatch login event
        this.dispatchAuthEvent('login', user);
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.app.currentUser = null;

        // Clear storage
        this.utils.removeStorage('user');

        // Update UI
        this.app.updateUserUI();

        // Dispatch logout event
        this.dispatchAuthEvent('logout');

        this.app.showNotification('تم تسجيل الخروج', 'success');
    }

    dispatchAuthEvent(type, data = null) {
        const event = new CustomEvent(`auth:${type}`, {
            detail: data
        });
        document.dispatchEvent(event);
    }

    showAuthModal(tab = 'login') {
        this.switchAuthTab(tab);
        this.utils.$('#authModal').classList.add('active');
        this.utils.$('#overlay').classList.add('active');
    }

    closeAuthModal() {
        this.utils.$('#authModal').classList.remove('active');
        this.utils.$('#overlay').classList.remove('active');

        // Reset forms
        this.utils.$('#loginForm').reset();
        this.utils.$('#registerForm').reset();
    }

    showAuthLoading() {
        const submitButtons = this.utils.$$('.auth-form button[type="submit"]');
        submitButtons.forEach(btn => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
        });
    }

    hideAuthLoading() {
        const submitButtons = this.utils.$$('.auth-form button[type="submit"]');
        submitButtons.forEach(btn => {
            btn.disabled = false;
            if (btn.closest('#loginForm')) {
                btn.textContent = this.app.translate('login');
            } else {
                btn.textContent = this.app.translate('register');
            }
        });
    }

    showForgotPassword() {
        const forgotPasswordHTML = `
            <div class="forgot-password-form">
                <h3>استعادة كلمة المرور</h3>
                <p>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور</p>
                <div class="form-group">
                    <label for="forgotEmail">البريد الإلكتروني</label>
                    <input type="email" id="forgotEmail" class="form-control" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="backToLogin">رجوع</button>
                    <button type="button" class="btn btn-primary" id="sendResetLink">إرسال الرابط</button>
                </div>
            </div>
        `;

        this.utils.$('#authModalContent').innerHTML = forgotPasswordHTML;

        // Bind events
        this.utils.$('#backToLogin').addEventListener('click', () => {
            this.initAuthModal();
            this.switchAuthTab('login');
        });

        this.utils.$('#sendResetLink').addEventListener('click', () => {
            this.handleForgotPassword();
        });
    }

    async handleForgotPassword() {
        const email = this.utils.$('#forgotEmail').value;

        if (!this.validateEmail(email)) {
            this.app.showNotification('البريد الإلكتروني غير صحيح', 'error');
            return;
        }

        try {
            this.utils.$('#sendResetLink').disabled = true;
            this.utils.$('#sendResetLink').innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.app.showNotification('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني', 'success');
            this.initAuthModal();
            this.switchAuthTab('login');

        } catch (error) {
            this.app.showNotification('حدث خطأ في إرسال الرابط', 'error');
        }
    }

    // Two-factor authentication
    async enable2FA() {
        // Implement 2FA setup

    }

    // Password strength checker
    checkPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return {
            score: strength,
            level: strength < 3 ? 'weak' : strength < 5 ? 'medium' : 'strong'
        };
    }

    // Session management
    checkSession() {
        if (this.isLoggedIn && this.currentUser) {
            // Check if session should be extended
            const lastActivity = this.utils.getStorage('lastActivity', 0);
            const now = Date.now();

            if (now - lastActivity > 30 * 60 * 1000) { // 30 minutes
                this.logout();
                return false;
            }

            // Update last activity
            this.utils.setStorage('lastActivity', now);
            return true;
        }
        return false;
    }

    updateLastActivity() {
        if (this.isLoggedIn) {
            this.utils.setStorage('lastActivity', Date.now());
        }
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}