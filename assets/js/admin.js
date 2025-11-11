// Admin Panel Management Class
class AdminManager {
    constructor(app) {
        this.app = app;
        this.stats = {
            visits: 0,
            products: 0,
            users: 0,
            orders: 0,
            revenue: 0
        };
        this.init();
    }

    init() {
        this.loadStats();
        this.initAdminPanel();
    }

    initAdminPanel() {
        const adminContent = `
            <div class="admin-section">
                <h4>إحصائيات الموقع</h4>
                <div class="admin-stats" id="adminStats">
                    <!-- Stats will be loaded dynamically -->
                </div>
            </div>

            <div class="admin-section">
                <h4>إدارة المنتجات</h4>
                <div class="admin-actions">
                    <button class="admin-btn" id="addProductBtn">
                        <i class="fas fa-plus"></i>
                        إضافة منتج
                    </button>
                    <button class="admin-btn" id="manageProductsBtn">
                        <i class="fas fa-edit"></i>
                        إدارة المنتجات
                    </button>
                </div>
                <div id="productsManagementArea"></div>
            </div>

            <div class="admin-section">
                <h4>إدارة العروض</h4>
                <div class="admin-actions">
                    <button class="admin-btn" id="addOfferBtn">
                        <i class="fas fa-plus"></i>
                        إضافة عرض
                    </button>
                    <button class="admin-btn" id="manageOffersBtn">
                        <i class="fas fa-edit"></i>
                        إدارة العروض
                    </button>
                </div>
                <div id="offersManagementArea"></div>
            </div>

            <div class="admin-section">
                <h4>إدارة المستخدمين</h4>
                <div class="admin-actions">
                    <button class="admin-btn" id="viewUsersBtn">
                        <i class="fas fa-users"></i>
                        عرض المستخدمين
                    </button>
                    <button class="admin-btn" id="manageOrdersBtn">
                        <i class="fas fa-shopping-cart"></i>
                        إدارة الطلبات
                    </button>
                </div>
                <div id="usersManagementArea"></div>
            </div>

            <div class="admin-section">
                <h4>إعدادات الموقع</h4>
                <div class="admin-actions">
                    <button class="admin-btn" id="siteSettingsBtn">
                        <i class="fas fa-cog"></i>
                        الإعدادات العامة
                    </button>
                    <button class="admin-btn" id="backupBtn">
                        <i class="fas fa-download"></i>
                        نسخ احتياطي
                    </button>
                </div>
            </div>
        `;

        const adminContentElement = document.querySelector('#adminContent');
        if (adminContentElement) {
            adminContentElement.innerHTML = adminContent;
            this.bindAdminEvents();
            this.loadAdminStats();
        }
    }

    bindAdminEvents() {
        // Products management
        const addProductBtn = document.querySelector('#addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showAddProductForm();
            });
        }

        const manageProductsBtn = document.querySelector('#manageProductsBtn');
        if (manageProductsBtn) {
            manageProductsBtn.addEventListener('click', () => {
                this.showProductsManagement();
            });
        }

        // Offers management
        const addOfferBtn = document.querySelector('#addOfferBtn');
        if (addOfferBtn) {
            addOfferBtn.addEventListener('click', () => {
                this.showAddOfferForm();
            });
        }

        const manageOffersBtn = document.querySelector('#manageOffersBtn');
        if (manageOffersBtn) {
            manageOffersBtn.addEventListener('click', () => {
                this.showOffersManagement();
            });
        }

        // Users management
        const viewUsersBtn = document.querySelector('#viewUsersBtn');
        if (viewUsersBtn) {
            viewUsersBtn.addEventListener('click', () => {
                this.showUsersManagement();
            });
        }

        const manageOrdersBtn = document.querySelector('#manageOrdersBtn');
        if (manageOrdersBtn) {
            manageOrdersBtn.addEventListener('click', () => {
                this.showOrdersManagement();
            });
        }

        // Site settings
        const siteSettingsBtn = document.querySelector('#siteSettingsBtn');
        if (siteSettingsBtn) {
            siteSettingsBtn.addEventListener('click', () => {
                this.showSiteSettings();
            });
        }

        const backupBtn = document.querySelector('#backupBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.createBackup();
            });
        }
    }

    loadStats() {
        this.stats = this.app.getStorage('adminStats', {
            visits: 1254,
            products: Object.values(this.app.products).flat().length,
            users: 89,
            orders: 234,
            revenue: 45780
        });
    }

    saveStats() {
        this.app.setStorage('adminStats', this.stats);
    }

    loadAdminStats() {
        const adminStatsElement = document.querySelector('#adminStats');
        if (!adminStatsElement) return;

        const statsHTML = `
            <div class="stat-card">
                <div class="stat-value">${this.stats.visits}</div>
                <div class="stat-label">الزيارات</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.stats.products}</div>
                <div class="stat-label">المنتجات</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.stats.users}</div>
                <div class="stat-label">المستخدمين</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.stats.orders}</div>
                <div class="stat-label">الطلبات</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.app.formatCurrency(this.stats.revenue)}</div>
                <div class="stat-label">إجمالي المبيعات</div>
            </div>
        `;

        adminStatsElement.innerHTML = statsHTML;
    }

    showAddProductForm() {
        const productsManagementArea = document.querySelector('#productsManagementArea');
        if (!productsManagementArea) return;

        const formHTML = `
            <div class="admin-form">
                <h5>إضافة منتج جديد</h5>
                <div class="form-group">
                    <label>اسم المنتج</label>
                    <input type="text" id="newProductName" class="form-control" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>السعر</label>
                        <input type="text" id="newProductPrice" class="form-control" placeholder="170 LE" required>
                    </div>
                    <div class="form-group">
                        <label>الفئة</label>
                        <select id="newProductCategory" class="form-control" required>
                            <option value="">اختر الفئة</option>
                            <option value="hair">العناية بالشعر</option>
                            <option value="face">العناية بالبشرة</option>
                            <option value="lips">مستحضرات الشفاه</option>
                            <option value="body">العناية بالجسم</option>
                            <option value="perfumes">العطور</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>صورة المنتج (رابط URL)</label>
                    <input type="url" id="newProductImage" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>الوصف</label>
                    <textarea id="newProductDescription" class="form-control" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label>المخزون</label>
                    <input type="number" id="newProductStock" class="form-control" value="10" min="0">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelAddProduct">إلغاء</button>
                    <button type="button" class="btn btn-success" id="saveProductBtn">حفظ المنتج</button>
                </div>
            </div>
        `;

        productsManagementArea.innerHTML = formHTML;

        // Bind form events
        const cancelAddProduct = document.querySelector('#cancelAddProduct');
        if (cancelAddProduct) {
            cancelAddProduct.addEventListener('click', () => {
                productsManagementArea.innerHTML = '';
            });
        }

        const saveProductBtn = document.querySelector('#saveProductBtn');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                this.saveNewProduct();
            });
        }
    }

    saveNewProduct() {
        const productData = {
            name: document.querySelector('#newProductName').value,
            price: document.querySelector('#newProductPrice').value,
            category: document.querySelector('#newProductCategory').value,
            image: document.querySelector('#newProductImage').value,
            description: document.querySelector('#newProductDescription').value,
            inStock: parseInt(document.querySelector('#newProductStock').value) > 0,
            rating: 4.0,
            reviewCount: 0
        };

        // Validation
        if (!this.validateProductData(productData)) {
            this.app.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        try {
            // Generate unique ID
            const newProduct = {
                id: this.app.generateId(productData.category),
                ...productData,
                createdAt: new Date().toISOString()
            };

            // Add to products
            if (!this.app.products[productData.category]) {
                this.app.products[productData.category] = [];
            }
            this.app.products[productData.category].push(newProduct);

            // Save to storage
            this.app.setStorage('products', this.app.products);

            // Update stats
            this.stats.products++;
            this.saveStats();
            this.loadAdminStats();

            // Clear form
            document.querySelector('#productsManagementArea').innerHTML = '';

            this.app.showNotification('تم إضافة المنتج بنجاح', 'success');

        } catch (error) {
            this.app.showNotification('حدث خطأ في حفظ المنتج', 'error');
            console.error('Save product error:', error);
        }
    }

    validateProductData(data) {
        return data.name && data.price && data.category && data.image && data.description;
    }

    showProductsManagement() {
        const products = this.app.getAllProducts();
        const productsManagementArea = document.querySelector('#productsManagementArea');
        if (!productsManagementArea) return;

        let productsHTML = `
            <div class="admin-table-container">
                <h5>إدارة المنتجات (${products.length})</h5>
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>الصورة</th>
                                <th>الاسم</th>
                                <th>السعر</th>
                                <th>الفئة</th>
                                <th>المخزون</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        products.forEach(product => {
            productsHTML += `
                <tr>
                    <td>
                        <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                    </td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${this.app.translate(product.category)}</td>
                    <td>
                        <span class="stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'متوفر' : 'غير متوفر'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon edit-product" data-product-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-product" data-product-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        productsHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        productsManagementArea.innerHTML = productsHTML;

        // Bind action buttons
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.edit-product').dataset.productId;
                this.editProduct(productId);
            });
        });

        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.delete-product').dataset.productId;
                this.deleteProduct(productId);
            });
        });
    }

    editProduct(productId) {
        const product = this.app.getProductById(productId);
        if (!product) return;

        const productsManagementArea = document.querySelector('#productsManagementArea');
        if (!productsManagementArea) return;

        const editFormHTML = `
            <div class="admin-form">
                <h5>تعديل المنتج</h5>
                <div class="form-group">
                    <label>اسم المنتج</label>
                    <input type="text" id="editProductName" class="form-control" value="${product.name}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>السعر</label>
                        <input type="text" id="editProductPrice" class="form-control" value="${product.price}" required>
                    </div>
                    <div class="form-group">
                        <label>الفئة</label>
                        <select id="editProductCategory" class="form-control" required>
                            <option value="hair" ${product.category === 'hair' ? 'selected' : ''}>العناية بالشعر</option>
                            <option value="face" ${product.category === 'face' ? 'selected' : ''}>العناية بالبشرة</option>
                            <option value="lips" ${product.category === 'lips' ? 'selected' : ''}>مستحضرات الشفاه</option>
                            <option value="body" ${product.category === 'body' ? 'selected' : ''}>العناية بالجسم</option>
                            <option value="perfumes" ${product.category === 'perfumes' ? 'selected' : ''}>العطور</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>صورة المنتج</label>
                    <input type="url" id="editProductImage" class="form-control" value="${product.image}" required>
                </div>
                <div class="form-group">
                    <label>الوصف</label>
                    <textarea id="editProductDescription" class="form-control" rows="4" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editProductInStock" ${product.inStock ? 'checked' : ''}>
                        متوفر في المخزون
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelEditProduct">إلغاء</button>
                    <button type="button" class="btn btn-success" id="updateProductBtn">تحديث المنتج</button>
                </div>
            </div>
        `;

        productsManagementArea.innerHTML = editFormHTML;

        // Bind form events
        document.querySelector('#cancelEditProduct').addEventListener('click', () => {
            this.showProductsManagement();
        });

        document.querySelector('#updateProductBtn').addEventListener('click', () => {
            this.updateProduct(productId);
        });
    }

    updateProduct(productId) {
        const updates = {
            name: document.querySelector('#editProductName').value,
            price: document.querySelector('#editProductPrice').value,
            category: document.querySelector('#editProductCategory').value,
            image: document.querySelector('#editProductImage').value,
            description: document.querySelector('#editProductDescription').value,
            inStock: document.querySelector('#editProductInStock').checked
        };

        if (this.updateProductInData(productId, updates)) {
            this.app.showNotification('تم تحديث المنتج بنجاح', 'success');
            this.showProductsManagement();
        } else {
            this.app.showNotification('حدث خطأ في تحديث المنتج', 'error');
        }
    }

    updateProductInData(productId, updates) {
        let updated = false;

        Object.keys(this.app.products).forEach(category => {
            const index = this.app.products[category].findIndex(p => p.id === productId);
            if (index !== -1) {
                this.app.products[category][index] = {
                    ...this.app.products[category][index],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                updated = true;
            }
        });

        if (updated) {
            this.app.setStorage('products', this.app.products);
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            if (this.deleteProductFromData(productId)) {
                this.stats.products--;
                this.saveStats();
                this.loadAdminStats();
                this.app.showNotification('تم حذف المنتج بنجاح', 'success');
                this.showProductsManagement();
            } else {
                this.app.showNotification('حدث خطأ في حذف المنتج', 'error');
            }
        }
    }

    deleteProductFromData(productId) {
        let deleted = false;

        Object.keys(this.app.products).forEach(category => {
            const initialLength = this.app.products[category].length;
            this.app.products[category] = this.app.products[category].filter(p => p.id !== productId);
            if (this.app.products[category].length !== initialLength) {
                deleted = true;
            }
        });

        if (deleted) {
            this.app.setStorage('products', this.app.products);
            return true;
        }
        return false;
    }

    showAddOfferForm() {
        const offersManagementArea = document.querySelector('#offersManagementArea');
        if (!offersManagementArea) return;

        const formHTML = `
            <div class="admin-form">
                <h5>إضافة عرض جديد</h5>
                <div class="form-group">
                    <label>عنوان العرض</label>
                    <input type="text" id="newOfferTitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>صورة العرض (رابط URL)</label>
                    <input type="url" id="newOfferImage" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>وصف العرض</label>
                    <textarea id="newOfferDescription" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>تاريخ البدء</label>
                        <input type="date" id="newOfferStartDate" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>تاريخ الانتهاء</label>
                        <input type="date" id="newOfferEndDate" class="form-control" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelAddOffer">إلغاء</button>
                    <button type="button" class="btn btn-success" id="saveOfferBtn">حفظ العرض</button>
                </div>
            </div>
        `;

        offersManagementArea.innerHTML = formHTML;

        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        document.querySelector('#newOfferStartDate').value = today;
        document.querySelector('#newOfferEndDate').value = nextWeek;

        // Bind form events
        document.querySelector('#cancelAddOffer').addEventListener('click', () => {
            offersManagementArea.innerHTML = '';
        });

        document.querySelector('#saveOfferBtn').addEventListener('click', () => {
            this.saveNewOffer();
        });
    }

    saveNewOffer() {
        this.app.showNotification('تم إضافة العرض بنجاح', 'success');
        document.querySelector('#offersManagementArea').innerHTML = '';
    }

    showOffersManagement() {
        const offersManagementArea = document.querySelector('#offersManagementArea');
        if (!offersManagementArea) return;

        offersManagementArea.innerHTML = `
            <div class="admin-notice">
                <i class="fas fa-info-circle"></i>
                <p>قسم إدارة العروض قيد التطوير</p>
            </div>
        `;
    }

    showUsersManagement() {
        const usersManagementArea = document.querySelector('#usersManagementArea');
        if (!usersManagementArea) return;

        usersManagementArea.innerHTML = `
            <div class="admin-notice">
                <i class="fas fa-info-circle"></i>
                <p>قسم إدارة المستخدمين قيد التطوير</p>
            </div>
        `;
    }

    showOrdersManagement() {
        const usersManagementArea = document.querySelector('#usersManagementArea');
        if (!usersManagementArea) return;

        usersManagementArea.innerHTML = `
            <div class="admin-notice">
                <i class="fas fa-info-circle"></i>
                <p>قسم إدارة الطلبات قيد التطوير</p>
            </div>
        `;
    }

    showSiteSettings() {
        const usersManagementArea = document.querySelector('#usersManagementArea');
        if (!usersManagementArea) return;

        const settingsHTML = `
            <div class="admin-form">
                <h5>الإعدادات العامة</h5>

                <div class="form-group">
                    <label>اسم المتجر</label>
                    <input type="text" class="form-control" value="Nona Beauty">
                </div>

                <div class="form-group">
                    <label>وصف المتجر</label>
                    <textarea class="form-control" rows="3">متجر متكامل لمستحضرات التجميل والعناية بالبشرة والشعر</textarea>
                </div>

                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" class="form-control" value="info@nonabeauty.com">
                </div>

                <div class="form-group">
                    <label>رقم الهاتف</label>
                    <input type="tel" class="form-control" value="01094004720">
                </div>

                <div class="form-group">
                    <label>العنوان</label>
                    <textarea class="form-control" rows="2">عنوان المتجر</textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-success" id="saveSettingsBtn">حفظ الإعدادات</button>
                </div>
            </div>
        `;

        usersManagementArea.innerHTML = settingsHTML;

        document.querySelector('#saveSettingsBtn').addEventListener('click', () => {
            this.app.showNotification('تم حفظ الإعدادات بنجاح', 'success');
        });
    }

    createBackup() {
        const backupData = {
            products: this.app.products,
            stats: this.stats,
            users: this.app.getStorage('users', []),
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nona-beauty-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);

        this.app.showNotification('تم إنشاء النسخة الاحتياطية', 'success');
    }
}

// Initialize Admin Manager when app is ready
if (window.nonaApp) {
    window.nonaApp.adminManager = new AdminManager(window.nonaApp);
}