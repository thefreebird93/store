class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.currentSort = 'featured';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
        this.loadCategories();
    }

    loadProducts() {
        // Try to load from localStorage first
        const savedProducts = localStorage.getItem('nonaBeautyProducts');
        
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        } else {
            // Load default products
            this.loadDefaultProducts();
        }
        
        this.filteredProducts = [...this.products];
    }

    loadDefaultProducts() {
        // Sample products data with discounts
        this.products = [
            {
                id: '1',
                name: 'Sulfate-Free Shampoo 400ml',
                price: 170,
                originalPrice: 200,
                discount: 15,
                category: 'hair',
                image: 'assets/images/products/shampoo.jpg',
                description: 'Gentle sulfate-free shampoo that cleanses without stripping natural oils.',
                rating: 4.5,
                reviewCount: 24,
                inStock: true,
                featured: true,
                tags: ['hair', 'care', 'natural']
            },
            {
                id: '2',
                name: 'Niacinamide Serum',
                price: 350,
                originalPrice: 420,
                discount: 17,
                category: 'face',
                image: 'assets/images/products/serum.jpg',
                description: 'Powerful serum for glowing skin with hyaluronic acid and niacinamide.',
                rating: 4.8,
                reviewCount: 45,
                inStock: true,
                featured: true,
                tags: ['skin', 'serum', 'brightening']
            },
            {
                id: '3',
                name: 'Floral Elegance Perfume 50ml',
                price: 400,
                originalPrice: 500,
                discount: 20,
                category: 'perfumes',
                image: 'assets/images/products/perfume.jpg',
                description: 'Elegant floral perfume with long-lasting fragrance.',
                rating: 4.7,
                reviewCount: 38,
                inStock: true,
                featured: false,
                tags: ['perfume', 'elegance', 'floral']
            },
            {
                id: '4',
                name: 'Hydrating Body Lotion',
                price: 120,
                originalPrice: 150,
                discount: 20,
                category: 'body',
                image: 'assets/images/products/lotion.jpg',
                description: 'Deeply hydrating body lotion for smooth and soft skin.',
                rating: 4.3,
                reviewCount: 32,
                inStock: true,
                featured: false,
                tags: ['body', 'lotion', 'hydrating']
            },
            {
                id: '5',
                name: 'Lip Care Balm',
                price: 50,
                category: 'lips',
                image: 'assets/images/products/balm.jpg',
                description: 'Nourishing lip balm for soft and hydrated lips.',
                rating: 4.6,
                reviewCount: 28,
                inStock: true,
                featured: false,
                tags: ['lips', 'balm', 'care']
            },
            {
                id: '6',
                name: 'Hair Growth Oil',
                price: 180,
                originalPrice: 220,
                discount: 18,
                category: 'hair',
                image: 'assets/images/products/hair-oil.jpg',
                description: 'Natural hair oil that promotes hair growth and strength.',
                rating: 4.4,
                reviewCount: 19,
                inStock: true,
                featured: false,
                tags: ['hair', 'oil', 'growth']
            }
        ];

        this.saveProducts();
    }

    saveProducts() {
        localStorage.setItem('nonaBeautyProducts', JSON.stringify(this.products));
    }

    setupEventListeners() {
        // Category filters
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.filterProducts();
            });
        });

        // Price range
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', () => {
                this.filterProducts();
            });
        }

        // Discount filters
        const discountFilters = document.querySelectorAll('input[name="discount"]');
        discountFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.filterProducts();
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
                this.displayProducts();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    loadCategories() {
        const categoriesContainer = document.querySelector('.categories-grid');
        const categoryFilters = document.querySelector('.category-filters');
        
        if (!categoriesContainer && !categoryFilters) return;

        const categories = [
            { id: 'hair', name: 'Hair Care', icon: 'fas fa-air-freshener' },
            { id: 'face', name: 'Skin Care', icon: 'fas fa-gem' },
            { id: 'lips', name: 'Lip Products', icon: 'fas fa-kiss-wink-heart' },
            { id: 'body', name: 'Body Care', icon: 'fas fa-spa' },
            { id: 'perfumes', name: 'Perfumes', icon: 'fas fa-wind' }
        ];

        // Load for categories grid (home page)
        if (categoriesContainer) {
            categoriesContainer.innerHTML = categories.map(category => `
                <div class="category-card" data-category="${category.id}">
                    <div class="category-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <h3>${category.name}</h3>
                    <p>Discover our amazing ${category.name.toLowerCase()} collection</p>
                </div>
            `).join('');

            // Add click events to category cards
            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', () => {
                    const category = card.dataset.category;
                    window.location.href = `products.html?category=${category}`;
                });
            });
        }

        // Load for category filters (products page)
        if (categoryFilters) {
            categoryFilters.innerHTML = categories.map(category => `
                <label>
                    <input type="checkbox" class="category-filter" value="${category.id}">
                    ${category.name}
                </label>
            `).join('');

            // Re-attach event listeners after rendering
            document.querySelectorAll('.category-filter').forEach(filter => {
                filter.addEventListener('change', () => {
                    this.filterProducts();
                });
            });
        }
    }

    filterProducts() {
        let filtered = [...this.products];

        // Category filter
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(checkbox => checkbox.value);
        
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category));
        }

        // Price filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            const maxPrice = parseInt(priceRange.value);
            filtered = filtered.filter(product => product.price <= maxPrice);
        }

        // Discount filter
        const selectedDiscounts = Array.from(document.querySelectorAll('input[name="discount"]:checked'))
            .map(checkbox => parseInt(checkbox.value));
        
        if (selectedDiscounts.length > 0) {
            filtered = filtered.filter(product => 
                product.discount && selectedDiscounts.some(discount => product.discount >= discount)
            );
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.sortProducts();
        this.displayProducts();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'discount':
                this.filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            case 'newest':
                // Assuming newer products have higher IDs
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
                break;
        }
    }

    displayProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #e2e8f0; margin-bottom: 20px;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');

        // Update load more button
        this.updateLoadMoreButton();

        // Add event listeners to product cards
        this.attachProductEventListeners();
    }

    createProductCard(product) {
        const discountBadge = product.discount ? `
            <div class="product-badge">${product.discount}% OFF</div>
        ` : '';

        const originalPrice = product.originalPrice ? `
            <span class="original-price">$${product.originalPrice}</span>
        ` : '';

        const discountPercent = product.discount ? `
            <span class="discount-percent">${product.discount}% OFF</span>
        ` : '';

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${discountBadge}
                <button class="wishlist-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='assets/images/products/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="rating">
                        ${this.generateStarRating(product.rating)}
                        <span class="review-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
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

    generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<span class="star"><i class="fas fa-star"></i></span>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<span class="star"><i class="fas fa-star-half-alt"></i></span>';
            } else {
                stars += '<span class="star empty"><i class="fas fa-star"></i></span>';
            }
        }

        return stars;
    }

    attachProductEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.add-to-cart').dataset.productId;
                this.addToCart(productId);
            });
        });

        // View details buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.view-details').dataset.productId;
                this.viewProductDetails(productId);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.wishlist-btn').dataset.productId;
                this.toggleWishlist(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            if (window.nonaBeautyApp) {
                window.nonaBeautyApp.addToCart(product);
            } else {
                // Fallback if main app is not available
                this.showNotification('Product added to cart!', 'success');
            }
        }
    }

    viewProductDetails(productId) {
        // Navigate to product details page or open modal
        window.location.href = `product-details.html?id=${productId}`;
    }

    toggleWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            if (window.nonaBeautyApp) {
                window.nonaBeautyApp.toggleWishlist(product);
                
                // Update heart icon
                const wishlistBtn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
                if (wishlistBtn) {
                    const isInWishlist = window.nonaBeautyApp.wishlist.some(item => item.id === productId);
                    wishlistBtn.innerHTML = `<i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>`;
                }
            }
        }
    }

    loadMoreProducts() {
        this.currentPage++;
        this.displayProducts();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (this.currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
        }

        this.currentPage = 1;
        this.sortProducts();
        this.displayProducts();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
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

    // Get featured products for home page
    getFeaturedProducts() {
        return this.products.filter(product => product.featured).slice(0, 6);
    }

    // Get products by category
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Get products on sale
    getProductsOnSale() {
        return this.products.filter(product => product.discount && product.discount > 0);
    }
}

// Initialize products manager
document.addEventListener('DOMContentLoaded', function() {
    window.productsManager = new ProductsManager();

    // Load featured products on home page
    const featuredGrid = document.querySelector('.featured-products .products-grid');
    if (featuredGrid) {
        const featuredProducts = window.productsManager.getFeaturedProducts();
        featuredGrid.innerHTML = featuredProducts.map(product => 
            window.productsManager.createProductCard(product)
        ).join('');
        window.productsManager.attachProductEventListeners();
    }

    // Load special offers
    const offersGrid = document.querySelector('.special-offers .offers-grid');
    if (offersGrid) {
        const offers = window.productsManager.getProductsOnSale().slice(0, 3);
        offersGrid.innerHTML = offers.map(product => `
            <div class="offer-card">
                <div class="offer-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="offer-badge">${product.discount}% OFF</div>
                </div>
                <div class="offer-content">
                    <h3>${product.name}</h3>
                    <div class="offer-price">
                        <span class="current-price">$${product.price}</span>
                        <span class="original-price">$${product.originalPrice}</span>
                    </div>
                    <p>${product.description}</p>
                    <button class="btn btn-primary" onclick="productsManager.addToCart('${product.id}')">
                        Shop Now
                    </button>
                </div>
            </div>
        `).join('');
    }
});
