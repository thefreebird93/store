// Main JavaScript file for Nona Beauty - Updated with EGP and Auto Offers
class NonaBeautyApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        this.products = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadProducts();
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

    // تحميل المنتجات
    loadProducts() {
        try {
            const productsData = localStorage.getItem('nonaBeautyProducts');
            if (productsData) {
                this.products = JSON.parse(productsData);
            } else {
                this.products = this.getSampleProducts();
                this.saveProducts();
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getSampleProducts();
        }
    }

    saveProducts() {
        localStorage.setItem('nonaBeautyProducts', JSON.stringify(this.products));
    }

    // الحصول على المنتجات ذات الخصومات
    getDiscountedProducts() {
        return this.products.filter(product => product.discount && product.discount > 0);
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
                window.location.href = 'wishlist.html';
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

    // بيانات المنتجات الافتراضية
    getSampleProducts() {
        return [
            {
                id: '1',
                name: 'Sulfate-Free Shampoo 400ml',
                price: 170,
                originalPrice: 200,
                discount: 15,
                category: 'hair',
                image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d5b6?w=400',
                description: 'Gentle sulfate-free shampoo for daily use on all hair types.',
                rating: 4.5,
                reviewCount: 128,
                featured: true,
                tags: ['hair', 'shampoo', 'sulfate-free']
            },
            {
                id: '2',
                name: 'Hydrating Face Serum',
                price: 350,
                originalPrice: 420,
                discount: 17,
                category: 'face',
                image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
                description: 'Deeply hydrating serum with vitamin C and hyaluronic acid.',
                rating: 4.8,
                reviewCount: 89,
                featured: true,
                tags: ['face', 'serum', 'hydrating']
            },
            {
                id: '3',
                name: 'Nourishing Body Lotion',
                price: 120,
                category: 'body',
                image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
                description: 'Rich body lotion for soft and smooth skin.',
                rating: 4.3,
                reviewCount: 67,
                featured: false,
                tags: ['body', 'lotion', 'moisturizing']
            },
            {
                id: '4',
                name: 'Lip Care Balm',
                price: 50,
                originalPrice: 65,
                discount: 23,
                category: 'lips',
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
                description: 'Moisturizing lip balm with natural ingredients.',
                rating: 4.6,
                reviewCount: 45,
                featured: false,
                tags: ['lips', 'balm', 'moisturizing']
            },
            {
                id: '5',
                name: 'Floral Perfume 50ml',
                price: 400,
                originalPrice: 500,
                discount: 20,
                category: 'perfumes',
                image: 'https://images.unsplash.com/photo-1590736969955-1d0c72c9b6b8?w=400',
                description: 'Elegant floral fragrance for everyday wear.',
                rating: 4.7,
                reviewCount: 156,
                featured: true,
                tags: ['perfume', 'floral', 'fragrance']
            },
            {
                id: '6',
                name: 'Hair Growth Oil',
                price: 180,
                originalPrice: 220,
                discount: 18,
                category: 'hair',
                image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
                description: 'Natural oil that promotes hair growth and strength.',
                rating: 4.4,
                reviewCount: 92,
                featured: false,
                tags: ['hair', 'oil', 'growth']
            },
            {
                id: '7',
                name: 'Anti-Aging Cream',
                price: 280,
                category: 'face',
                image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
                description: 'Advanced anti-aging cream with retinol.',
                rating: 4.6,
                reviewCount: 78,
                featured: false,
                tags: ['face', 'cream', 'anti-aging']
            },
            {
                id: '8',
                name: 'Body Scrub',
                price: 90,
                originalPrice: 120,
                discount: 25,
                category: 'body',
                image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
                description: 'Exfoliating body scrub for smooth skin.',
                rating: 4.2,
                reviewCount: 34,
                featured: false,
                tags: ['body', 'scrub', 'exfoliating']
            }
        ];
    }

    // وظائف مساعدة
    formatPrice(price) {
        return `${price} EGP`;
    }

    createProductCard(product) {
        const discountBadge = product.discount ? `
            <div class="product-badge">${product.discount}% OFF</div>
        ` : '';

        const originalPrice = product.originalPrice ? `
            <span class="original-price">${this.formatPrice(product.originalPrice)}</span>
        ` : '';

        const discountPercent = product.discount ? `
            <span class="discount-percent">${product.discount}% OFF</span>
        ` : '';

        // إنشاء نجوم التقييم
        let ratingStars = '';
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                ratingStars += '<span class="star"><i class="fas fa-star"></i></span>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                ratingStars += '<span class="star"><i class="fas fa-star-half-alt"></i></span>';
            } else {
                ratingStars += '<span class="star empty"><i class="fas fa-star"></i></span>';
            }
        }

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${discountBadge}
                <button class="wishlist-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="rating">
                        ${ratingStars}
                        <span class="review-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(product.price)}</span>
                        ${originalPrice}
                        ${discountPercent}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                        <button class="btn btn-outline view-details" data-product-id="${product.id}">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // إرفاق الأحداث لمنتجات
    attachProductEventListeners() {
        // إضافة إلى السلة
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.add-to-cart').dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.addToCart(product);
                }
            });
        });

        // عرض التفاصيل
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.view-details').dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    if (product.discount && product.discount > 0) {
                        // إذا كان المنتج عليه خصم، الانتقال لصفحة العروض
                        window.location.href = `offers.html?product=${productId}`;
                    } else {
                        // إذا لم يكن عليه خصم، عرض التفاصيل العادية
                        this.showNotification(`Viewing details for: ${product.name}`, 'info');
                    }
                }
            });
        });

        // قائمة الأمنيات
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.wishlist-btn').dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.toggleWishlist(product);
                    
                    // تحديث الأيقونة
                    const isInWishlist = this.wishlist.some(item => item.id === productId);
                    e.target.closest('.wishlist-btn').innerHTML = `<i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>`;
                }
            });
        });
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
    return `${price} EGP`;
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
