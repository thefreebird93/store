class OffersManager {
    constructor() {
        this.offers = [];
        this.bundles = [];
        this.filteredOffers = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadOffers();
        this.setupEventListeners();
        this.displayOffers();
        this.startCountdownTimer();
    }

    loadOffers() {
        // In a real app, this would be an API call
        // For now, we'll use the data from offers.json
        this.offers = [
            {
                id: '1',
                title: 'Mega Skincare Sale',
                description: 'Up to 50% off on selected skincare products',
                discount: 50,
                type: 'percentage',
                category: 'skincare',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                isActive: true,
                featured: true,
                image: 'assets/images/offers/skincare-sale.jpg'
            },
            {
                id: '2',
                title: 'Buy 2 Get 1 Free - Haircare',
                description: 'Purchase any two haircare products and get one free',
                discount: 100,
                type: 'bogo',
                category: 'haircare',
                startDate: '2024-01-15',
                endDate: '2024-02-15',
                isActive: true,
                featured: false,
                image: 'assets/images/offers/haircare-bogo.jpg'
            },
            {
                id: '3',
                title: 'Winter Perfume Collection - 25% OFF',
                description: 'Special discount on our winter perfume collection',
                discount: 25,
                type: 'percentage',
                category: 'perfumes',
                startDate: '2023-12-01',
                endDate: '2024-02-29',
                isActive: true,
                featured: true,
                image: 'assets/images/offers/winter-perfumes.jpg'
            }
        ];

        this.bundles = [
            {
                id: 'bundle-1',
                name: 'Complete Skincare Routine',
                description: 'Everything you need for perfect skin',
                originalPrice: 120.00,
                bundlePrice: 89.99,
                discount: 25,
                image: 'assets/images/offers/skincare-bundle.jpg',
                products: ['2', '3', '4', '5']
            },
            {
                id: 'bundle-2',
                name: 'Luxury Haircare Set',
                description: 'Transform your hair with our premium collection',
                originalPrice: 85.00,
                bundlePrice: 65.99,
                discount: 22,
                image: 'assets/images/offers/haircare-bundle.jpg',
                products: ['1', '6', '10', '11']
            }
        ];

        this.filteredOffers = [...this.offers];
    }

    setupEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterOffers(filter);
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletterForm);
            });
        }
    }

    filterOffers(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredOffers = this.offers.filter(offer => offer.isActive);
        } else {
            this.filteredOffers = this.offers.filter(offer => 
                offer.isActive && offer.category === filter
            );
        }
        
        this.displayOffers();
    }

    displayOffers() {
        const offersGrid = document.getElementById('offersGrid');
        if (!offersGrid) return;

        if (this.filteredOffers.length === 0) {
            offersGrid.innerHTML = `
                <div class="no-offers" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-tag" style="font-size: 48px; color: #e2e8f0; margin-bottom: 20px;"></i>
                    <h3>No offers available</h3>
                    <p>Check back later for new promotions</p>
                </div>
            `;
            return;
        }

        offersGrid.innerHTML = this.filteredOffers.map(offer => this.createOfferCard(offer)).join('');
    }

    createOfferCard(offer) {
        const badgeType = offer.type === 'bogo' ? 'BOGO' : 
                         offer.type === 'shipping' ? 'FREE SHIPPING' : 
                         `${offer.discount}% OFF`;

        const daysLeft = this.getDaysLeft(offer.endDate);
        const timeLeftText = daysLeft > 0 ? `${daysLeft} days left` : 'Ending soon';

        return `
            <div class="offer-card" data-offer-id="${offer.id}">
                <div class="offer-image">
                    <img src="${offer.image}" alt="${offer.title}">
                    <div class="offer-badge">${badgeType}</div>
                    <div class="time-left">${timeLeftText}</div>
                </div>
                <div class="offer-content">
                    <h3>${offer.title}</h3>
                    <p>${offer.description}</p>
                    <div class="offer-meta">
                        <span class="category">${offer.category}</span>
                        <span class="valid-until">Valid until ${new Date(offer.endDate).toLocaleDateString()}</span>
                    </div>
                    <button class="btn btn-primary" onclick="offersManager.applyOffer('${offer.id}')">
                        Shop Now
                    </button>
                </div>
            </div>
        `;
    }

    getDaysLeft(endDate) {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    applyOffer(offerId) {
        const offer = this.offers.find(o => o.id === offerId);
        if (offer) {
            // Navigate to products page with offer filter
            if (offer.category !== 'all') {
                window.location.href = `products.html?category=${offer.category}&offer=${offerId}`;
            } else {
                window.location.href = `products.html?offer=${offerId}`;
            }
        }
    }

    startCountdownTimer() {
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 7); // 7 days from now

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update display
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownTimer);
                // Reset timer for next week
                setTimeout(() => {
                    this.startCountdownTimer();
                }, 1000);
            }
        }

        // Update immediately and then every second
        updateCountdown();
        const countdownTimer = setInterval(updateCountdown, 1000);
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
        }, 1000);
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

    // Get active offers
    getActiveOffers() {
        const now = new Date();
        return this.offers.filter(offer => 
            offer.isActive && 
            new Date(offer.startDate) <= now && 
            new Date(offer.endDate) >= now
        );
    }

    // Get featured offers for home page
    getFeaturedOffers() {
        return this.getActiveOffers().filter(offer => offer.featured).slice(0, 3);
    }
}

// Initialize offers manager
document.addEventListener('DOMContentLoaded', function() {
    window.offersManager = new OffersManager();
});
