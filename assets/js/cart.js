// Shopping Cart Management Class
class CartManager {
    constructor(app) {
        this.app = app;
        this.utils = app.utils;
        this.items = [];
        this.loadCart();
    }

    loadCart() {
        const savedCart = this.utils.getStorage('cart', []);
        this.items = savedCart;
        this.updateCartUI();
    }

    saveCart() {
        this.utils.setStorage('cart', this.items);
        this.updateCartUI();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.app.showNotification(this.app.translate('productAdded'), 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => {
            const price = this.utils.extractPrice(item.price);
            return total + (price * item.quantity);
        }, 0);
    }

    getTotal() {
        return this.getSubtotal(); // In real app, add taxes/shipping
    }

    updateCartUI() {
        // Update cart count
        const cartCount = this.utils.$('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }

        // Update cart sidebar
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItems = this.utils.$('#cartItems');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>${this.app.translate('emptyCart')}</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${this.utils.formatCurrency(this.utils.extractPrice(item.price) * item.quantity)}</div>
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
        const cartTotal = this.utils.$('#cartTotal');
        if (cartTotal) {
            cartTotal.textContent = this.utils.formatCurrency(this.getTotal());
        }

        // Bind events
        this.bindCartEvents();
    }

    bindCartEvents() {
        // Quantity buttons
        this.utils.$$('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        this.utils.$$('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Remove buttons
        this.utils.$$('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-item').dataset.productId;
                this.removeItem(productId);
            });
        });
    }

    // Checkout process
    async checkout() {
        if (this.items.length === 0) {
            this.app.showNotification(this.app.translate('emptyCart'), 'warning');
            return;
        }

        try {
            // In real app, process payment and create order
            const order = await this.createOrder();
            this.clearCart();
            this.app.showNotification(this.app.translate('orderSent'), 'success');
            return order;
        } catch (error) {
            this.app.showNotification('خطأ في إتمام الطلب', 'error');
            throw error;
        }
    }

    async createOrder() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: this.utils.generateId('order'),
                    items: this.items,
                    total: this.getTotal(),
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });
            }, 1000);
        });
    }
}