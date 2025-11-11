// Products Management Class
class ProductsManager {
    constructor(app) {
        this.app = app;
        this.utils = app.utils;
        this.products = {};
        this.categories = [];
        this.filters = {
            category: 'all',
            priceRange: [0, 1000],
            inStock: true,
            sortBy: 'name'
        };
    }

    async init() {
        await this.loadProducts();
        this.categories = this.extractCategories();
    }

    async loadProducts() {
        try {
            // Try to load from localStorage first
            const cachedProducts = this.utils.getStorage('products');
            if (cachedProducts && this.isCacheValid(cachedProducts)) {
                this.products = cachedProducts.data;
            } else {
                // Load from API or fallback
                this.products = await this.fetchProducts();
                this.utils.setStorage('products', {
                    data: this.products,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getFallbackProducts();
        }
    }

    async fetchProducts() {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    hair: [
                        {
                            id: 'hair_1',
                            name: 'شامبو خالي من الكبريتات',
                            price: '170 LE',
                            image: 'https://images.unsplash.com/photo-1627992795905-59b43c6838a5?q=80&w=300',
                            description: 'شامبو لطيف خالي من الكبريتات',
                            category: 'hair',
                            inStock: true,
                            rating: 4.5,
                            reviewCount: 24
                        }
                    ],
                    face: [
                        {
                            id: 'face_1', 
                            name: 'سيروم نياسمينيد',
                            price: '350 LE',
                            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=300',
                            description: 'مصل قوي للبشرة المشرقة',
                            category: 'face',
                            inStock: true,
                            rating: 4.8,
                            reviewCount: 45
                        }
                    ]
                    // ... other categories
                });
            }, 500);
        });
    }

    getFallbackProducts() {
        return window.productsData || {};
    }

    extractCategories() {
        return Object.keys(this.products).map(category => ({
            id: category,
            name: this.app.translate(category),
            count: this.products[category].length,
            icon: this.getCategoryIcon(category)
        }));
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

    getProductsByCategory(category) {
        return category === 'all' 
            ? this.getAllProducts()
            : this.products[category] || [];
    }

    getAllProducts() {
        return Object.values(this.products).flat();
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.getAllProducts().filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    filterProducts(products, filters = this.filters) {
        let filtered = [...products];

        // Apply category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Apply price range filter
        filtered = filtered.filter(product => {
            const price = this.extractPrice(product.price);
            return price >= filters.priceRange[0] && price <= filters.priceRange[1];
        });

        // Apply stock filter
        if (filters.inStock) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Apply sorting
        filtered = this.sortProducts(filtered, filters.sortBy);

        return filtered;
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];

        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => this.extractPrice(a.price) - this.extractPrice(b.price));
            case 'price-high':
                return sorted.sort((a, b) => this.extractPrice(b.price) - this.extractPrice(a.price));
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.reverse(); // In real app, use date field
            default:
                return sorted;
        }
    }

    extractPrice(priceString) {
        const price = priceString.replace(/[^0-9.]/g, '');
        return parseFloat(price) || 0;
    }

    getProductById(id) {
        return this.getAllProducts().find(product => product.id === id);
    }

    getRelatedProducts(product, limit = 4) {
        return this.getAllProducts()
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, limit);
    }

    isCacheValid(cachedData) {
        const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
        return Date.now() - cachedData.timestamp < CACHE_DURATION;
    }

    // Admin methods
    addProduct(productData) {
        const newProduct = {
            id: this.utils.generateId(productData.category),
            ...productData,
            createdAt: new Date().toISOString(),
            rating: 0,
            reviewCount: 0
        };

        if (!this.products[productData.category]) {
            this.products[productData.category] = [];
        }

        this.products[productData.category].push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(productId, updates) {
        let productFound = false;

        Object.keys(this.products).forEach(category => {
            const index = this.products[category].findIndex(p => p.id === productId);
            if (index !== -1) {
                this.products[category][index] = {
                    ...this.products[category][index],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                productFound = true;
            }
        });

        if (productFound) {
            this.saveProducts();
        }

        return productFound;
    }

    deleteProduct(productId) {
        let deleted = false;

        Object.keys(this.products).forEach(category => {
            const initialLength = this.products[category].length;
            this.products[category] = this.products[category].filter(p => p.id !== productId);
            if (this.products[category].length !== initialLength) {
                deleted = true;
            }
        });

        if (deleted) {
            this.saveProducts();
        }

        return deleted;
    }

    saveProducts() {
        this.utils.setStorage('products', {
            data: this.products,
            timestamp: Date.now()
        });
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsManager;
}