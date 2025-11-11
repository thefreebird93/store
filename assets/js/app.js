// Main Application Class - Final Fixed Version
class NonaBeautyApp {
    constructor() {
        console.log('🔄 NonaBeautyApp constructor called');
        this.currentUser = null;
        this.currentLanguage = 'ar';
        this.currentTheme = 'light';
        this.isLoading = false;
        this.cart = [];
        this.products = {};
        this.categories = [];

        // Initialize app immediately
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Starting app initialization...');

            // Show loading screen
            this.showLoading();

            // Initialize basic functionality first
            this.initBasicFunctionality();

            // Load user preferences
            this.loadUserPreferences();

            // Initialize event listeners
            this.initEventListeners();

            // Load home page
            this.loadHomePage();

            console.log('✅ App initialized successfully');

        } catch (error) {
            console.error('❌ App initialization error:', error);
            this.showNotification('حدث خطأ في تحميل التطبيق', 'error');
        } finally {
            // Always hide loading after 1 second
            setTimeout(() => {
                this.hideLoading();
            }, 1000);
        }
    }

    // Basic DOM utilities
    $(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.error('DOM query error:', error);
            return null;
        }
    }

    $$(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.error('DOM query error:', error);
            return [];
        }
    }

    // Storage utilities
    setStorage(key, value) {
        try {
            localStorage.setItem(`nona_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`nona_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    }

    removeStorage(key) {
        try {
            localStorage.removeItem(`nona_${key}`);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    // Price and Currency utilities
    extractPrice(priceString) {
        try {
            const price = priceString.replace(/[^0-9.]/g, '');
            return parseFloat(price) || 0;
        } catch (error) {
            console.error('Error extracting price:', error);
            return 0;
        }
    }

    formatCurrency(amount, currency = 'LE') {
        try {
            return new Intl.NumberFormat('ar-EG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount) + ` ${currency}`;
        } catch (error) {
            console.error('Error formatting currency:', error);
            return amount + ' ' + currency;
        }
    }

    // Validation utilities
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^01[0-2,5]{1}[0-9]{8}$/;
        return re.test(phone);
    }

    // Generate Unique ID
    generateId(prefix = '') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    initBasicFunctionality() {
        console.log('🔧 Initializing basic functionality...');
        
        // Load products data
        this.loadProductsData();

        // Initialize cart
        this.initCart();
        
        console.log('✅ Basic functionality initialized');
    }

    initCart() {
        console.log('🛒 Initializing cart...');
        this.cart = this.getStorage('cart', []);
        this.updateCartUI();
    }

    loadProductsData() {
        console.log('📦 Loading products data...');
        
        // Use window.productsData or fallback
        this.products = window.productsData || this.getFallbackProducts();
        this.categories = this.extractCategories();
        
        console.log('✅ Products loaded:', Object.keys(this.products));
    }

    getFallbackProducts() {
        console.log('🔄 Using fallback products data');
        return {
            hair: [
                {
                    id: 'hair_1',
                    name: 'شامبو خالي من الكبريتات',
                    price: '170 LE',
                    image: 'https://images.unsplash.com/photo-1627992795905-59b43c6838a5?q=80&w=300&auto=format&fit=crop',
                    description: 'شامبو لطيف خالي من الكبريتات',
                    category: 'hair',
                    inStock: true,
                    rating: 4.5,
                    reviewCount: 24
                },
                {
                    id: 'hair_2', 
                    name: 'بلسم خالي من الكبريتات',
                    price: '180 LE',
                    image: 'https://images.unsplash.com/photo-1627992795905-59b43c6838a5?q=80&w=300&auto=format&fit=crop',
                    description: 'بلسم خالي من الكبريتات يفك التشابك ويرطب الشعر',
                    category: 'hair',
                    inStock: true,
                    rating: 4.3,
                    reviewCount: 18
                }
            ],
            face: [
                {
                    id: 'face_1',
                    name: 'سيروم نياسمينيد',
                    price: '350 LE',
                    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=300&auto=format&fit=crop',
                    description: 'مصل قوي يجمع بين الهيالورونيك والنياسيناميد',
                    category: 'face',
                    inStock: true,
                    rating: 4.8,
                    reviewCount: 45
                }
            ],
            lips: [
                {
                    id: 'lips_1',
                    name: 'لمعان شفاه',
                    price: '65 LE',
                    image: 'https://images.unsplash.com/photo-1616738910404-b9c2982d1c68?q=80&w=300&auto=format&fit=crop',
                    description: 'لمعان شفاه عالي اللمعان في أنبوب ضغط مريح',
                    category: 'lips',
                    inStock: true,
                    rating: 4.1,
                    reviewCount: 12
                }
            ],
            body: [
                {
                    id: 'body_1',
                    name: 'جل استحمام',
                    price: '120 LE',
                    image: 'https://images.unsplash.com/photo-1628177579624-a745c92e92c4?q=80&w=300&auto=format&fit=crop',
                    description: 'جل استحمام منعش ينظف ويرطب البشرة',
                    category: 'body',
                    inStock: true,
                    rating: 4.3,
                    reviewCount: 16
                }
            ],
            perfumes: [
                {
                    id: 'perfumes_1',
                    name: 'عطر 30 مل',
                    price: '260 LE',
                    image: 'https://images.unsplash.com/photo-1596462502895-d85290b3a097?q=80&w=300&auto=format&fit=crop',
                    description: 'عطر أنيق بحجم 30 مل مريح',
                    category: 'perfumes',
                    inStock: true,
                    rating: 4.6,
                    reviewCount: 40
                }
            ]
        };
    }

    extractCategories() {
        try {
            return Object.keys(this.products).map(category => ({
                id: category,
                name: this.translate(category),
                count: this.products[category] ? this.products[category].length : 0,
                icon: this.getCategoryIcon(category)
            }));
        } catch (error) {
            console.error('Error extracting categories:', error);
            return [];
        }
    }

    getCategoryIcon(category) {
        const icons = {
            hair: 'fa-air-freshener',
            face: 'fa-gem',
            lips: 'fa-kiss-wink-heart',
            body: 'fa-spa',
            perfumes: 'fa-wind'
        };
        return icons[category] || 'fa-cube';
    }

    initEventListeners() {
        console.log('🎯 Setting up event listeners...');

        try {
            // Language switcher
            this.$$('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    this.switchLanguage(lang);
                });
            });

            // Mobile menu
            const mobileMenuBtn = this.$('#mobileMenuBtn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
            }

            // Search functionality
            const searchIcon = this.$('#searchIcon');
            if (searchIcon) {
                searchIcon.addEventListener('click', () => {
                    this.toggleSearch();
                });
            }

            const searchClose = this.$('#searchClose');
            if (searchClose) {
                searchClose.addEventListener('click', () => {
                    this.closeSearch();
                });
            }

            // Dark mode toggle
            const darkModeToggle = this.$('#darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('click', () => {
                    this.toggleDarkMode();
                });
            }

            // Back to top
            const backToTop = this.$('#backToTop');
            if (backToTop) {
                backToTop.addEventListener('click', () => {
                    this.scrollToTop();
                });
            }

            // Navigation
            this.$$('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = e.currentTarget.dataset.page;
                    this.navigateTo(page);
                });
            });

            // Cart icon
            const cartIcon = this.$('#cartIcon');
            if (cartIcon) {
                cartIcon.addEventListener('click', () => {
                    this.$('#cartSidebar').classList.add('open');
                    this.$('#overlay').classList.add('active');
                });
            }

            // Close buttons
            const overlay = this.$('#overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.closeAllModals();
                });
            }

            const closeCart = this.$('.close-cart');
            if (closeCart) {
                closeCart.addEventListener('click', () => {
                    this.$('#cartSidebar').classList.remove('open');
                    this.$('#overlay').classList.remove('active');
                });
            }

            const closeAdmin = this.$('.close-admin');
            if (closeAdmin) {
                closeAdmin.addEventListener('click', () => {
                    this.$('#adminPanel').classList.remove('open');
                    this.$('#overlay').classList.remove('active');
                });
            }

            const closeModal = this.$('.close-modal');
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    this.closeAllModals();
                });
            }

            // Auth buttons
            const loginBtn = this.$('#loginBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthModal('login');
                });
            }

            const registerBtn = this.$('#registerBtn');
            if (registerBtn) {
                registerBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthModal('register');
                });
            }

            // Admin button
            const adminBtn = this.$('#adminBtn');
            if (adminBtn) {
                adminBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.$('#adminPanel').classList.add('open');
                    this.$('#overlay').classList.add('active');
                });
            }

            // Window events
            window.addEventListener('scroll', () => {
                this.handleScroll();
            });

            // Close modals on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllModals();
                }
            });

            console.log('✅ Event listeners setup completed');

        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
        }
    }

    loadHomePage() {
        console.log('🏠 Loading home page...');
        try {
            this.loadPopularProducts();
            this.loadCategories();
            console.log('✅ Home page loaded successfully');
        } catch (error) {
            console.error('Error loading home page:', error);
        }
    }

    loadPopularProducts() {
        try {
            const products = this.getAllProducts().slice(0, 6);
            this.renderProductsGrid(products, 'homeProductsGrid');
        } catch (error) {
            console.error('Error loading popular products:', error);
        }
    }

    loadCategories() {
        try {
            const container = this.$('#categoriesGrid');
            if (!container) {
                console.warn('❌ Categories container not found');
                return;
            }

            container.innerHTML = this.categories.map(category => `
                <div class="category-card" data-category="${category.id}">
                    <div class="category-icon">
                        <i class="fas ${category.icon}"></i>
                    </div>
                    <h3>${category.name}</h3>
                    <p>${category.count} منتج</p>
                </div>
            `).join('');

            // Bind category events
            this.$$('.category-card').forEach(card => {
                card.addEventListener('click', () => {
                    const category = card.dataset.category;
                    this.navigateTo('products');
                });
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    getAllProducts() {
        try {
            return Object.values(this.products).flat();
        } catch (error) {
            console.error('Error getting all products:', error);
            return [];
        }
    }

    getProductById(id) {
        try {
            return this.getAllProducts().find(product => product.id === id);
        } catch (error) {
            console.error('Error getting product by ID:', error);
            return null;
        }
    }

    renderProductsGrid(products, containerId) {
        try {
            const container = this.$(`#${containerId}`);
            if (!container) {
                console.warn(`❌ Container ${containerId} not found`);
                return;
            }

            if (products.length === 0) {
                container.innerHTML = '<p>لا توجد منتجات لعرضها</p>';
                return;
            }

            container.innerHTML = products.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <button class="wishlist-btn" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-price">${product.price}</div>
                        <div class="rating">
                            ${this.generateStarRating(product.rating)}
                            <span class="review-count">(${product.reviewCount})</span>
                        </div>
                        <div class="product-actions">
                            <button class="add-to-cart" data-product-id="${product.id}">
                                ${this.translate('addToCart')}
                            </button>
                            <button class="view-details" data-product-id="${product.id}">
                                ${this.translate('viewDetails')}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Bind product events
            this.bindProductEvents(container);
        } catch (error) {
            console.error('Error rendering products grid:', error);
        }
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }

        // Half star
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }

        return stars;
    }

    bindProductEvents(container) {
        try {
            container.addEventListener('click', (e) => {
                // Add to cart buttons
                if (e.target.closest('.add-to-cart')) {
                    const productId = e.target.closest('.add-to-cart').dataset.productId;
                    const product = this.getProductById(productId);
                    if (product) {
                        this.addToCart(product);
                    }
                }

                // View details buttons
                if (e.target.closest('.view-details')) {
                    const productId = e.target.closest('.view-details').dataset.productId;
                    this.showProductDetails(productId);
                }

                // Wishlist buttons
                if (e.target.closest('.wishlist-btn')) {
                    const productId = e.target.closest('.wishlist-btn').dataset.productId;
                    this.toggleWishlist(productId);
                }
            });
        } catch (error) {
            console.error('Error binding product events:', error);
        }
    }

    addToCart(product) {
        try {
            const existingItem = this.cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    ...product,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }

            this.saveCart();
            this.showNotification(this.translate('productAdded'), 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('حدث خطأ في إضافة المنتج', 'error');
        }
    }

    saveCart() {
        try {
            this.setStorage('cart', this.cart);
            this.updateCartUI();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    updateCartUI() {
        try {
            // Update cart count
            const cartCount = this.$('.cart-count');
            if (cartCount) {
                const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
            }

            // Update cart sidebar
            this.renderCartItems();
        } catch (error) {
            console.error('Error updating cart UI:', error);
        }
    }

    renderCartItems() {
        try {
            const cartItems = this.$('#cartItems');
            if (!cartItems) return;

            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>${this.translate('emptyCart')}</p>
                    </div>
                `;
                return;
            }

            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${this.formatCurrency(this.extractPrice(item.price) * item.quantity)}</div>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="decrease-quantity" data-product-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-quantity" data-product-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-product-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Update total
            const cartTotal = this.$('#cartTotal');
            if (cartTotal) {
                const total = this.cart.reduce((sum, item) => {
                    const price = this.extractPrice(item.price);
                    return sum + (price * item.quantity);
                }, 0);
                cartTotal.textContent = this.formatCurrency(total);
            }

            // Bind cart events
            this.bindCartEvents();
        } catch (error) {
            console.error('Error rendering cart items:', error);
        }
    }

    bindCartEvents() {
        try {
            // Quantity buttons
            this.$$('.decrease-quantity').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('.decrease-quantity').dataset.productId;
                    const item = this.cart.find(item => item.id === productId);
                    if (item && item.quantity > 1) {
                        item.quantity -= 1;
                        this.saveCart();
                    } else if (item && item.quantity === 1) {
                        this.cart = this.cart.filter(item => item.id !== productId);
                        this.saveCart();
                    }
                });
            });

            this.$$('.increase-quantity').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('.increase-quantity').dataset.productId;
                    const item = this.cart.find(item => item.id === productId);
                    if (item) {
                        item.quantity += 1;
                        this.saveCart();
                    }
                });
            });

            // Remove buttons
            this.$$('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('.remove-item').dataset.productId;
                    this.cart = this.cart.filter(item => item.id !== productId);
                    this.saveCart();
                });
            });

            // Checkout button
            const checkoutBtn = this.$('#checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    this.checkout();
                });
            }
        } catch (error) {
            console.error('Error binding cart events:', error);
        }
    }

    checkout() {
        try {
            if (this.cart.length === 0) {
                this.showNotification(this.translate('emptyCart'), 'warning');
                return;
            }

            // Create order text for WhatsApp
            let orderText = `مرحباً Nona Beauty، أود طلب المنتجات التالية:%0A%0A`;

            this.cart.forEach(item => {
                orderText += `- ${item.name} (${item.quantity}) - ${this.formatCurrency(this.extractPrice(item.price) * item.quantity)}%0A`;
            });

            const total = this.cart.reduce((sum, item) => {
                return sum + (this.extractPrice(item.price) * item.quantity);
            }, 0);

            orderText += `%0Aالمجموع: ${this.formatCurrency(total)}%0A%0Aشكراً!`;

            // Open WhatsApp
            window.open(`https://wa.me/201094004720?text=${orderText}`, '_blank');

            // Clear cart
            this.cart = [];
            this.saveCart();

            // Close cart
            this.closeAllModals();

            this.showNotification('تم إرسال طلبك بنجاح', 'success');
        } catch (error) {
            console.error('Error during checkout:', error);
            this.showNotification('حدث خطأ في إتمام الطلب', 'error');
        }
    }

    toggleWishlist(productId) {
        this.showNotification('تمت الإضافة إلى قائمة الأمنيات', 'success');
    }

    showProductDetails(productId) {
        try {
            const product = this.getProductById(productId);
            if (!product) return;

            const modalContent = `
                <div class="modal-product">
                    <div class="modal-product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="modal-product-info">
                        <h2>${product.name}</h2>
                        <div class="modal-product-price">${product.price}</div>
                        <div class="rating">
                            ${this.generateStarRating(product.rating)}
                            <span class="review-count">(${product.reviewCount} تقييم)</span>
                        </div>
                        <div class="modal-product-description">
                            ${product.description}
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart-modal" data-product-id="${product.id}">
                                ${this.translate('addToCart')}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.$('#modalProductContent').innerHTML = modalContent;
            this.$('#productModal').classList.add('active');
            this.$('#overlay').classList.add('active');

            // Bind modal add to cart
            this.$('.add-to-cart-modal').addEventListener('click', () => {
                this.addToCart(product);
                this.closeAllModals();
            });
        } catch (error) {
            console.error('Error showing product details:', error);
        }
    }

    // Navigation Methods
    navigateTo(page) {
        try {
            // Hide all pages
            this.$$('.page').forEach(p => p.classList.remove('active'));

            // Show target page
            const targetPage = this.$(`#${page}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // Update active navigation
            this.updateActiveNav(page);

            // Close mobile menu if open
            this.closeMobileMenu();

            // Scroll to top
            this.scrollToTop();

            // Load page-specific content
            this.loadPageContent(page);
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    }

    loadPageContent(page) {
        try {
            switch (page) {
                case 'products':
                    this.loadAllProducts();
                    break;
                case 'categories':
                    this.loadCategoriesPage();
                    break;
                case 'offers':
                    this.loadOffers();
                    break;
                case 'contact':
                    this.loadContactPage();
                    break;
            }
        } catch (error) {
            console.error('Error loading page content:', error);
        }
    }

    loadAllProducts() {
        try {
            const products = this.getAllProducts();
            this.renderProductsGrid(products, 'productsContent');
        } catch (error) {
            console.error('Error loading all products:', error);
        }
    }

    loadCategoriesPage() {
        try {
            // يمكن إضافة محتوى إضافي لصفحة الفئات
        } catch (error) {
            console.error('Error loading categories page:', error);
        }
    }

    loadContactPage() {
        try {
            // يمكن إضافة محتوى إضافي لصفحة الاتصال
        } catch (error) {
            console.error('Error loading contact page:', error);
        }
    }

    loadOffers() {
        try {
            const offers = [
                {
                    title: 'عرض خاص على منتجات الشعر',
                    description: 'خصم 20% على جميع منتجات العناية بالشعر',
                    image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=300&auto=format&fit=crop'
                },
                {
                    title: 'عرض العطور',
                    description: 'اشترِ عطرين واحصل على الثالث مجاناً',
                    image: 'https://images.unsplash.com/photo-1588776814546-1d1a1f0c6b9a?q=80&w=300&auto=format&fit=crop'
                }
            ];

            this.renderOffersGrid(offers);
        } catch (error) {
            console.error('Error loading offers:', error);
        }
    }

    renderOffersGrid(offers) {
        try {
            const container = this.$('#offersGrid');
            if (!container) return;

            container.innerHTML = offers.map(offer => `
                <div class="offer-card">
                    <div class="offer-image">
                        <img src="${offer.image}" alt="${offer.title}">
                    </div>
                    <div class="offer-content">
                        <h3>${offer.title}</h3>
                        <p>${offer.description}</p>
                        <button class="btn btn-primary">عرض التفاصيل</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error rendering offers grid:', error);
        }
    }

    // Language Methods
    switchLanguage(lang) {
        try {
            this.currentLanguage = lang;

            // Update UI
            this.$$('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // Update document direction
            document.body.classList.toggle('english', lang === 'en');
            document.body.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
            document.documentElement.setAttribute('lang', lang);

            // Save preference
            this.setStorage('language', lang);

            // Update all translatable text
            this.updateAllTexts();

            this.showNotification(
                lang === 'ar' ? 'تم التبديل إلى اللغة العربية' : 'Switched to English',
                'success'
            );
        } catch (error) {
            console.error('Error switching language:', error);
        }
    }

    updateAllTexts() {
        try {
            this.$$('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.translate(key);

                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });
        } catch (error) {
            console.error('Error updating texts:', error);
        }
    }

    translate(key) {
        try {
            const translations = window.fallbackTranslations;
            return translations[this.currentLanguage]?.[key] || key;
        } catch (error) {
            console.error('Error translating:', error);
            return key;
        }
    }

    // Theme Methods
    switchTheme(theme) {
        try {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            this.setStorage('theme', theme);
        } catch (error) {
            console.error('Error switching theme:', error);
        }
    }

    toggleDarkMode() {
        try {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.switchTheme(newTheme);

            this.showNotification(
                newTheme === 'dark' ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري',
                'success'
            );
        } catch (error) {
            console.error('Error toggling dark mode:', error);
        }
    }

    // Search Methods
    toggleSearch() {
        try {
            const searchContainer = this.$('#searchBar');
            if (searchContainer) {
                searchContainer.classList.toggle('active');

                if (searchContainer.classList.contains('active')) {
                    this.$('#searchInput').focus();
                }
            }
        } catch (error) {
            console.error('Error toggling search:', error);
        }
    }

    closeSearch() {
        try {
            const searchContainer = this.$('#searchBar');
            if (searchContainer) {
                searchContainer.classList.remove('active');
                this.$('#searchInput').value = '';
            }
        } catch (error) {
            console.error('Error closing search:', error);
        }
    }

    // Auth Methods
    showAuthModal(tab = 'login') {
        try {
            const authContent = `
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">${this.translate('login')}</button>
                    <button class="auth-tab" data-tab="register">${this.translate('register')}</button>
                </div>

                <form class="auth-form active" id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">${this.translate('email')}</label>
                        <input type="email" id="loginEmail" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="loginPassword">${this.translate('password')}</label>
                        <input type="password" id="loginPassword" class="form-control" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        ${this.translate('login')}
                    </button>
                </form>

                <form class="auth-form" id="registerForm">
                    <div class="form-group">
                        <label for="registerName">${this.translate('fullName')}</label>
                        <input type="text" id="registerName" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="registerEmail">${this.translate('email')}</label>
                        <input type="email" id="registerEmail" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="registerPassword">${this.translate('password')}</label>
                        <input type="password" id="registerPassword" class="form-control" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        ${this.translate('register')}
                    </button>
                </form>
            `;

            this.$('#authModalContent').innerHTML = authContent;
            this.$('#authModal').classList.add('active');
            this.$('#overlay').classList.add('active');

            // Bind auth events
            this.bindAuthEvents();
        } catch (error) {
            console.error('Error showing auth modal:', error);
        }
    }

    bindAuthEvents() {
        try {
            // Tab switching
            this.$$('.auth-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    this.switchAuthTab(tabName);
                });
            });

            // Form submissions
            this.$('#loginForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            this.$('#registerForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        } catch (error) {
            console.error('Error binding auth events:', error);
        }
    }

    switchAuthTab(tab) {
        try {
            // Update active tab
            this.$$('.auth-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.tab === tab);
            });

            // Show active form
            this.$$('.auth-form').forEach(form => {
                form.classList.toggle('active', form.id === `${tab}Form`);
            });
        } catch (error) {
            console.error('Error switching auth tab:', error);
        }
    }

    handleLogin() {
        try {
            const email = this.$('#loginEmail').value;
            const password = this.$('#loginPassword').value;

            // Basic validation
            if (!email || !password) {
                this.showNotification('يرجى ملء جميع الحقول', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                this.showNotification('البريد الإلكتروني غير صحيح', 'error');
                return;
            }

            // Mock login - في التطبيق الحقيقي سيتم الاتصال بالخادم
            this.currentUser = {
                name: 'مستخدم تجريبي',
                email: email,
                isAdmin: email === 'admin@nonabeauty.com'
            };

            this.updateUserUI();
            this.closeAllModals();
            this.showNotification('تم تسجيل الدخول بنجاح', 'success');

        } catch (error) {
            console.error('Error handling login:', error);
            this.showNotification('حدث خطأ في تسجيل الدخول', 'error');
        }
    }

    handleRegister() {
        try {
            const name = this.$('#registerName').value;
            const email = this.$('#registerEmail').value;
            const password = this.$('#registerPassword').value;

            // Basic validation
            if (!name || !email || !password) {
                this.showNotification('يرجى ملء جميع الحقول', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                this.showNotification('البريد الإلكتروني غير صحيح', 'error');
                return;
            }

            if (password.length < 6) {
                this.showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
                return;
            }

            // Mock registration
            this.currentUser = {
                name: name,
                email: email,
                isAdmin: false
            };

            this.updateUserUI();
            this.closeAllModals();
            this.showNotification('تم إنشاء الحساب بنجاح', 'success');

        } catch (error) {
            console.error('Error handling register:', error);
            this.showNotification('حدث خطأ في إنشاء الحساب', 'error');
        }
    }

    updateUserUI() {
        try {
            const userActions = this.$('#userActions');
            if (!userActions) return;

            if (this.currentUser) {
                userActions.innerHTML = `
                    <span class="user-welcome">مرحباً، ${this.currentUser.name}</span>
                    <a href="#" class="auth-btn logout-btn" id="logoutBtn">تسجيل الخروج</a>
                    ${this.currentUser.isAdmin ? '<a href="#" class="auth-btn admin-btn" id="adminBtn"><i class="fas fa-cog"></i></a>' : ''}
                `;

                // Add logout event
                const logoutBtn = this.$('#logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                    });
                }

                // Add admin event
                const adminBtn = this.$('#adminBtn');
                if (adminBtn) {
                    adminBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.$('#adminPanel').classList.add('open');
                        this.$('#overlay').classList.add('active');
                    });
                }
            } else {
                userActions.innerHTML = `
                    <a href="#" class="auth-btn login-btn" id="loginBtn">تسجيل الدخول</a>
                    <a href="#" class="auth-btn register-btn" id="registerBtn">إنشاء حساب</a>
                `;

                // Re-bind auth events
                this.$('#loginBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthModal('login');
                });

                this.$('#registerBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthModal('register');
                });
            }
        } catch (error) {
            console.error('Error updating user UI:', error);
        }
    }

    logout() {
        try {
            this.currentUser = null;
            this.updateUserUI();
            this.showNotification('تم تسجيل الخروج', 'success');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    // Loading Methods
    showLoading() {
        try {
            const loader = this.$('#pageLoader');
            if (loader) {
                loader.classList.remove('hidden');
            }
            this.isLoading = true;
        } catch (error) {
            console.error('Error showing loading:', error);
        }
    }

    hideLoading() {
        try {
            const loader = this.$('#pageLoader');
            if (loader) {
                loader.classList.add('hidden');
            }
            this.isLoading = false;
        } catch (error) {
            console.error('Error hiding loading:', error);
        }
    }

    // Scroll Methods
    handleScroll() {
        try {
            const backToTop = this.$('#backToTop');
            if (backToTop) {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }

            // Add header shadow on scroll
            const header = this.$('#mainHeader');
            if (header) {
                if (window.pageYOffset > 50) {
                    header.style.boxShadow = 'var(--shadow)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }
        } catch (error) {
            console.error('Error handling scroll:', error);
        }
    }

    scrollToTop() {
        try {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('Error scrolling to top:', error);
        }
    }

    // Mobile Menu Methods
    toggleMobileMenu() {
        try {
            const nav = this.$('#mainNav');
            if (nav) {
                nav.classList.toggle('active');
            }
        } catch (error) {
            console.error('Error toggling mobile menu:', error);
        }
    }

    closeMobileMenu() {
        try {
            const nav = this.$('#mainNav');
            if (nav) {
                nav.classList.remove('active');
            }
        } catch (error) {
            console.error('Error closing mobile menu:', error);
        }
    }

    // Notification Methods
    showNotification(message, type = 'info', duration = 3000) {
        try {
            const container = this.$('#notificationContainer');
            if (!container) return;

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            `;

            container.appendChild(notification);

            // Remove after duration
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }
            }, duration);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
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

    // Utility Methods
    closeAllModals() {
        try {
            this.$$('.modal').forEach(modal => {
                modal.classList.remove('active');
            });

            const overlay = this.$('#overlay');
            if (overlay) {
                overlay.classList.remove('active');
            }

            const cartSidebar = this.$('#cartSidebar');
            if (cartSidebar) {
                cartSidebar.classList.remove('open');
            }

            const adminPanel = this.$('#adminPanel');
            if (adminPanel) {
                adminPanel.classList.remove('open');
            }

            this.closeSearch();
            this.closeMobileMenu();
        } catch (error) {
            console.error('Error closing modals:', error);
        }
    }

    updateActiveNav(activePage) {
        try {
            this.$$('.nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.page === activePage);
            });
        } catch (error) {
            console.error('Error updating active nav:', error);
        }
    }

    loadUserPreferences() {
        try {
            // Load language preference
            const savedLang = this.getStorage('language', 'ar');
            this.switchLanguage(savedLang);

            // Load theme preference
            const savedTheme = this.getStorage('theme', 'light');
            this.switchTheme(savedTheme);

            // Load user data
            const savedUser = this.getStorage('user');
            if (savedUser) {
                this.currentUser = savedUser;
                this.updateUserUI();
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - Starting Nona Beauty App');
    window.nonaApp = new NonaBeautyApp();
});

// Fallback: initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('⚡ DOM already ready - Starting Nona Beauty App immediately');
    setTimeout(() => {
        window.nonaApp = new NonaBeautyApp();
    }, 100);
}

// Emergency fallback - start app after 3 seconds if not started
setTimeout(() => {
    if (!window.nonaApp) {
        console.log('🚨 Emergency fallback - Starting app manually');
        window.nonaApp = new NonaBeautyApp();
    }
}, 3000);