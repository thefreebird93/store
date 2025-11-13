// Main JavaScript file for Nona Beauty
class NonaBeautyApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadCart();
        this.loadWishlist();
        this.setupEventListeners();
        this.updateUI();
    }

    // User Management
    loadUserData() {
        const userData = localStorage.getItem('nonaBeautyUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('nonaBeautyUser', JSON.stringify(this.currentUser));
        }
    }

    login(userData) {
        this.currentUser = userData;
        this.saveUserData();
        this.updateUI();
        this.showNotification('Login successful!', 'success');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('nonaBeautyUser');
        this.updateUI();
        this.showNotification('Logged out successfully', 'info');
    }

    // Cart Management
    loadCart() {
        const cartData = localStorage.getItem('nonaBeautyCart');
        if (cartData) {
            this.cart = JSON.parse(cartData);
        }
    }

    saveCart() {
        localStorage.setItem('nonaBeautyCart', JSON.stringify(this.cart));
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Product added to cart!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    // Wishlist Management
    loadWishlist() {
        const wishlistData = localStorage.getItem('nonaBeautyWishlist');
        if (wishlistData) {
            this.wishlist = JSON.parse(wishlistData);
        }
    }

    saveWishlist() {
        localStorage.setItem('nonaBeautyWishlist', JSON.stringify(this.wishlist));
    }

    toggleWishlist(product) {
        const index = this.wishlist.findIndex(item => item.id === product.id);
        
        if (index === -1) {
            this.wishlist.push(product);
            this.showNotification('Product added to wishlist!', 'success');
        } else {
            this.wishlist.splice(index, 1);
            this.showNotification('Product removed from wishlist', 'info');
        }
        
        this.saveWishlist();
        this.updateWishlistUI();
    }

    updateWishlistUI() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }
    }

    // UI Updates
    updateUI() {
        this.updateUserUI();
        this.updateCartUI();
        this.updateWishlistUI();
    }

    updateUserUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Event Listeners
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Cart icon
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                this.openCart();
            });
        }

        // Wishlist icon
        const wishlistIcon = document.getElementById('wishlistIcon');
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', () => {
                this.openWishlist();
            });
        }
    }

    openCart() {
        // Implementation for opening cart sidebar
        console.log('Open cart functionality');
    }

    openWishlist() {
        // Implementation for opening wishlist page
        window.location.href = 'wishlist.html';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.nonaBeautyApp = new NonaBeautyApp();
    
    // Hide loading screen
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);
});
