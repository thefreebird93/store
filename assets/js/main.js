// Main JavaScript file for Nona Beauty - Fixed Version
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
        this.setupMobileMenu();
    }

    // إدارة المستخدم
    loadUserData() {
        try {
            const userData = localStorage.getItem('nonaBeautyUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('nonaBeautyUser', JSON.stringify(this.currentUser));
        }
    }

    // إدارة السلة
    loadCart() {
        try {
            const cartData = localStorage.getItem('nonaBeautyCart');
            if (cartData) {
                this.cart = JSON.parse(cartData);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
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

    // إدارة قائمة الأمنيات
    loadWishlist() {
        try {
            const wishlistData = localStorage.getItem('nonaBeautyWishlist');
            if (wishlistData) {
                this.wishlist = JSON.parse(wishlistData);
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            this.wishlist = [];
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

    // تحديث واجهة المستخدم
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

        if (this.currentUser && userMenu) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            userMenu.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.name;
        } else if (userMenu) {
            userMenu.style.display = 'none';
        }
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateWishlistUI() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }
    }

    // إعداد الأحداث
    setupEventListeners() {
        // زر تسجيل الخروج
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // أيقونة السلة
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                this.showNotification('Cart functionality will be implemented', 'info');
            });
        }

        // أيقونة قائمة الأمنيات
        const wishlistIcon = document.getElementById('wishlistIcon');
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', () => {
                this.showNotification('Wishlist page coming soon', 'info');
            });
        }
    }

    // القائمة المتنقلة
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');

        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });

            // إغلاق القائمة عند النقر على رابط
            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                });
            });
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('nonaBeautyUser');
        this.updateUI();
        this.showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // الإشعارات
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // إضافة الأنماط إذا لم تكن موجودة في CSS
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
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

        // إزالة الإشعار بعد 3 ثوان
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

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#d63384'
        };
        return colors[type] || '#d63384';
    }

    // أدوات مساعدة
    formatPrice(price) {
        return `$${parseFloat(price).toFixed(2)}`;
    }

    // تحميل البيانات
    loadSampleData() {
        // بيانات المنتجات الافتراضية
        const sampleProducts = [
            {
                id: '1',
                name: 'Sulfate-Free Shampoo',
                price: 17.99,
                originalPrice: 22.99,
                discount: 22,
                category: 'hair',
                image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d5b6?w=400',
                description: 'Gentle sulfate-free shampoo for daily use.',
                rating: 4.5,
                reviewCount: 128
            },
            {
                id: '2', 
                name: 'Hydrating Face Serum',
                price: 29.99,
                originalPrice: 39.99,
                discount: 25,
                category: 'face',
                image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
                description: 'Deeply hydrating serum with vitamin C.',
                rating: 4.8,
                reviewCount: 89
            },
            {
                id: '3',
                name: 'Body Lotion',
                price: 14.99,
                category: 'body', 
                image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
                description: 'Nourishing body lotion for soft skin.',
                rating: 4.3,
                reviewCount: 67
            }
        ];

        // حفظ إذا لم تكن موجودة
        if (!localStorage.getItem('nonaBeautyProducts')) {
            localStorage.setItem('nonaBeautyProducts', JSON.stringify(sampleProducts));
        }

        return sampleProducts;
    }
}

// تهيئة التطبيق عند تحميل DOM
document.addEventListener('DOMContentLoaded', function() {
    window.nonaBeautyApp = new NonaBeautyApp();
    
    // إخفاء شاشة التحميل
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);
});

// وظائف مساعدة عالمية
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

function showLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
    }
}
