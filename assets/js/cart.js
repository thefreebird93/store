class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartUI();
    }

    loadCart() {
        const cartData = localStorage.getItem('nonaBeautyCart');
        if (cartData) {
            this.cart = JSON.parse(cartData);
        }
    }

    saveCart() {
        localStorage.setItem('nonaBeautyCart', JSON.stringify(this.cart));
    }

    setupEventListeners() {
        // Cart icon click
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                this.toggleCartSidebar();
            });
        }

        // Close cart
        const closeCartBtn = document.querySelector('.close-cart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }

        // Overlay click
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
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
        this.showNotification('Product removed from cart', 'info');
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartSidebar();
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartSidebar() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const emptyCart = document.getElementById('emptyCart');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartItems) cartItems.style.display = 'none';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItems) cartItems.style.display = 'block';

        // Update cart items
        cartItems.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');

        // Update total
        if (cartTotal) {
            cartTotal.textContent = `$${this.calculateTotal().toFixed(2)}`;
        }

        // Attach event listeners to cart items
        this.attachCartItemEventListeners();
    }

    createCartItemHTML(item) {
        const originalPrice = item.originalPrice ? `
            <div class="item-original-price">$${item.originalPrice}</div>
        ` : '';

        const discount = item.discount ? `
            <div class="item-discount">${item.discount}% OFF</div>
        ` : '';

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='assets/images/products/placeholder.jpg'">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <div class="item-price">
                        <span class="current-price">$${item.price}</span>
                        ${originalPrice}
                    </div>
                    ${discount}
                    <div class="item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" data-product-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-product-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachCartItemEventListeners() {
        // Decrease quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quantity-btn').dataset.productId;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Increase quantity buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quantity-btn').dataset.productId;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-item').dataset.productId;
                this.removeFromCart(productId);
            });
        });
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    calculateDiscounts() {
        return this.cart.reduce((total, item) => {
            if (item.originalPrice) {
                return total + ((item.originalPrice - item.price) * item.quantity);
            }
            return total;
        }, 0);
    }

    toggleCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar && overlay) {
            cartSidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    }

    closeCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar && overlay) {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('nonaBeautyUser') || 'null');
        
        if (!currentUser) {
            this.showNotification('Please login to proceed with checkout', 'warning');
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html?redirect=checkout';
            }, 1500);
            return;
        }

        // Create order
        const order = {
            id: 'ORD-' + Date.now(),
            items: [...this.cart],
            total: this.calculateTotal(),
            discount: this.calculateDiscounts(),
            customer: {
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone
            },
            shippingAddress: currentUser.addresses?.find(addr => addr.isDefault) || currentUser.address,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save order
        this.saveOrder(order);

        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.closeCartSidebar();

        // Show success message
        this.showNotification('Order placed successfully!', 'success');

        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = `order-confirmation.html?id=${order.id}`;
        }, 2000);
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('nonaBeautyOrders') || '[]');
        orders.push(order);
        localStorage.setItem('nonaBeautyOrders', JSON.stringify(orders));
    }

    getCartSummary() {
        return {
            items: this.cart.length,
            total: this.calculateTotal(),
            discount: this.calculateDiscounts(),
            itemsCount: this.cart.reduce((total, item) => total + item.quantity, 0)
        };
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

    // Apply coupon code
    applyCoupon(code) {
        const coupons = {
            'WELCOME10': { discount: 10, type: 'percentage' },
            'SAVE20': { discount: 20, type: 'percentage' },
            'FREESHIP': { discount: 0, type: 'shipping', description: 'Free Shipping' }
        };

        const coupon = coupons[code.toUpperCase()];
        
        if (coupon) {
            this.showNotification(`Coupon applied: ${code}`, 'success');
            return coupon;
        } else {
            this.showNotification('Invalid coupon code', 'error');
            return null;
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Cart cleared', 'info');
    }
}

// Initialize cart manager
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
});
