class AdminPanel {
    constructor() {
        this.currentPage = 'dashboard';
        this.products = [];
        this.orders = [];
        this.customers = [];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.showPage('dashboard');
        this.loadDashboardStats();
        this.loadRecentOrders();
    }

    loadData() {
        // Load products from localStorage or API
        const savedProducts = localStorage.getItem('nonaBeautyProducts');
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        } else {
            // Load default products
            this.loadDefaultProducts();
        }

        // Load orders
        const savedOrders = localStorage.getItem('nonaBeautyOrders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        }

        // Load customers
        const savedCustomers = localStorage.getItem('nonaBeautyCustomers');
        if (savedCustomers) {
            this.customers = JSON.parse(savedCustomers);
        }
    }

    loadDefaultProducts() {
        // This would typically come from an API
        this.products = [
            {
                id: '1',
                name: 'Sulfate-Free Shampoo',
                category: 'hair',
                price: 170,
                originalPrice: 200,
                discount: 15,
                image: 'assets/images/products/shampoo.jpg',
                stock: 45,
                status: 'inStock',
                featured: true
            },
            {
                id: '2',
                name: 'Niacinamide Serum',
                category: 'face',
                price: 350,
                originalPrice: 420,
                discount: 17,
                image: 'assets/images/products/serum.jpg',
                stock: 23,
                status: 'inStock',
                featured: true
            },
            {
                id: '3',
                name: 'Floral Elegance Perfume',
                category: 'perfumes',
                price: 400,
                originalPrice: 500,
                discount: 20,
                image: 'assets/images/products/perfume.jpg',
                stock: 15,
                status: 'inStock',
                featured: false
            }
        ];
        this.saveProducts();
    }

    saveProducts() {
        localStorage.setItem('nonaBeautyProducts', JSON.stringify(this.products));
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('href').substring(1);
                this.showPage(page);
            });
        });

        // Add Product Button
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.openAddProductModal();
            });
        }

        // Modal Controls
        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const cancelProductBtn = document.getElementById('cancelProduct');
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const saveProductBtn = document.getElementById('saveProduct');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                this.saveProduct();
            });
        }

        // Logout
        const adminLogoutBtn = document.getElementById('adminLogout');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Search
        const adminSearch = document.getElementById('adminSearch');
        if (adminSearch) {
            adminSearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
        });

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(page);
        }

        // Load page-specific content
        this.loadPageContent(page);

        this.currentPage = page;
    }

    getPageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            products: 'Products Management',
            categories: 'Categories Management',
            orders: 'Orders Management',
            customers: 'Customers Management',
            offers: 'Offers & Discounts',
            blog: 'Blog & Tips',
            settings: 'Settings'
        };
        return titles[page] || 'Dashboard';
    }

    loadPageContent(page) {
        switch (page) {
            case 'products':
                this.loadProductsTable();
                break;
            case 'categories':
                this.loadCategoriesTable();
                break;
            case 'orders':
                this.loadOrdersTable();
                break;
            case 'customers':
                this.loadCustomersTable();
                break;
            case 'offers':
                this.loadOffersTable();
                break;
            case 'blog':
                this.loadBlogTable();
                break;
            default:
                break;
        }
    }

    loadDashboardStats() {
        const stats = {
            totalSales: this.calculateTotalSales(),
            totalOrders: this.orders.length,
            totalCustomers: this.customers.length,
            totalProducts: this.products.length,
            salesChange: '+12%',
            ordersChange: '+8%',
            customersChange: '+15%',
            productsChange: '-2%'
        };

        // Update stats cards
        this.updateStatCard('sales', stats.totalSales, stats.salesChange);
        this.updateStatCard('orders', stats.totalOrders, stats.ordersChange);
        this.updateStatCard('customers', stats.totalCustomers, stats.customersChange);
        this.updateStatCard('products', stats.totalProducts, stats.productsChange);

        // Load sales chart
        this.loadSalesChart();

        // Load top products
        this.loadTopProducts();
    }

    calculateTotalSales() {
        return this.orders.reduce((total, order) => total + order.total, 0);
    }

    updateStatCard(type, value, change) {
        const statNumber = document.querySelector(`.stat-icon.${type} + .stat-info .stat-number`);
        const statChange = document.querySelector(`.stat-icon.${type} + .stat-info .stat-change`);
        
        if (statNumber) {
            if (type === 'sales') {
                statNumber.textContent = `$${value.toLocaleString()}`;
            } else {
                statNumber.textContent = value.toLocaleString();
            }
        }
        
        if (statChange) {
            statChange.textContent = change;
            statChange.className = `stat-change ${change.startsWith('+') ? 'positive' : 'negative'}`;
        }
    }

    loadSalesChart() {
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Sample data - in real app, this would come from API
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#d63384',
                backgroundColor: 'rgba(214, 51, 132, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);
    }

    loadTopProducts() {
        const topProductsContainer = document.getElementById('topProducts');
        if (!topProductsContainer) return;

        // Get top 3 products by sales (in real app, this would be calculated)
        const topProducts = this.products.slice(0, 3);
        
        topProductsContainer.innerHTML = topProducts.map((product, index) => `
            <div class="product-rank">
                <span class="rank">${index + 1}</span>
                <span class="product-name">${product.name}</span>
                <span class="sales-count">${Math.floor(Math.random() * 100) + 50} sales</span>
            </div>
        `).join('');
    }

    loadRecentOrders() {
        const ordersTable = document.getElementById('recentOrdersTable');
        if (!ordersTable) return;

        // Sample orders data
        const recentOrders = [
            { id: 'ORD-001', customer: 'John Doe', date: '2024-01-15', amount: 170, status: 'Completed' },
            { id: 'ORD-002', customer: 'Jane Smith', date: '2024-01-14', amount: 350, status: 'Processing' },
            { id: 'ORD-003', customer: 'Mike Johnson', date: '2024-01-13', amount: 400, status: 'Shipped' },
            { id: 'ORD-004', customer: 'Sarah Wilson', date: '2024-01-12', amount: 220, status: 'Completed' },
            { id: 'ORD-005', customer: 'Tom Brown', date: '2024-01-11', amount: 180, status: 'Pending' }
        ];

        ordersTable.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>$${order.amount}</td>
                <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary">View</button>
                    <button class="btn btn-sm btn-secondary">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    loadProductsTable() {
        const productsTable = document.getElementById('productsTable');
        if (!productsTable) return;

        productsTable.innerHTML = this.products.map(product => `
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}" class="product-image-small" onerror="this.src='assets/images/products/placeholder.jpg'">
                </td>
                <td>${product.name}</td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>
                    $${product.price}
                    ${product.originalPrice ? `<br><small class="text-muted"><del>$${product.originalPrice}</del></small>` : ''}
                </td>
                <td>
                    ${product.discount ? `<span class="discount-percent">${product.discount}% OFF</span>` : 'No discount'}
                </td>
                <td>${product.stock}</td>
                <td>
                    <span class="status-badge status-${product.status}">
                        ${product.status === 'inStock' ? 'In Stock' : 
                          product.status === 'outOfStock' ? 'Out of Stock' : 'On Sale'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteProduct('${product.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    getCategoryName(categoryId) {
        const categories = {
            hair: 'Hair Care',
            face: 'Skin Care',
            lips: 'Lip Products',
            body: 'Body Care',
            perfumes: 'Perfumes'
        };
        return categories[categoryId] || categoryId;
    }

    openAddProductModal() {
        const modal = document.getElementById('addProductModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal() {
        const modal = document.getElementById('addProductModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    saveProduct() {
        const form = document.getElementById('productForm');
        if (!form) return;

        const formData = new FormData(form);
        const productData = {
            id: Date.now().toString(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            description: document.getElementById('productDescription').value,
            image: 'assets/images/products/placeholder.jpg', // Default image
            status: 'inStock',
            featured: false
        };

        this.products.push(productData);
        this.saveProducts();
        this.loadProductsTable();
        this.closeModal();
        this.showNotification('Product added successfully!', 'success');

        // Reset form
        form.reset();
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Populate form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productDescription').value = product.description || '';

            // Change modal title and button
            document.querySelector('#addProductModal .modal-header h3').textContent = 'Edit Product';
            document.getElementById('saveProduct').textContent = 'Update Product';

            this.openAddProductModal();
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.loadProductsTable();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        let filteredProducts = this.products;

        if (categoryFilter !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
        }

        if (statusFilter !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.status === statusFilter);
        }

        this.displayFilteredProducts(filteredProducts);
    }

    displayFilteredProducts(products) {
        const productsTable = document.getElementById('productsTable');
        if (!productsTable) return;

        // Similar to loadProductsTable but with filtered data
        productsTable.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="product-image-small"></td>
                <td>${product.name}</td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>$${product.price}</td>
                <td>${product.discount || 'No discount'}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge status-${product.status}">${product.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteProduct('${product.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    handleSearch(query) {
        if (this.currentPage === 'products') {
            const filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
            this.displayFilteredProducts(filteredProducts);
        }
    }

    logout() {
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#d63384'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 300
