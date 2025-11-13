class TipsManager {
    constructor() {
        this.tips = [];
        this.filteredTips = [];
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.tipsPerPage = 6;
        this.init();
    }

    init() {
        this.loadTips();
        this.setupEventListeners();
        this.displayTips();
    }

    loadTips() {
        // In a real app, this would be an API call
        this.tips = [
            {
                id: '1',
                title: 'The Ultimate Daily Skincare Routine',
                excerpt: 'Discover the essential steps for maintaining healthy, glowing skin every day.',
                content: 'Full article content here...',
                category: 'skincare',
                author: 'Dr. Emily Chen',
                publishDate: '2024-01-15',
                readTime: '8 min',
                image: 'assets/images/tips/skincare-routine.jpg',
                featured: true,
                tags: ['skincare', 'routine', 'daily']
            },
            {
                id: '2',
                title: 'Winter Skincare: Protecting Your Skin in Cold Weather',
                excerpt: 'Learn how to adapt your skincare routine for the harsh winter months.',
                category: 'skincare',
                author: 'Dr. Sarah Mitchell',
                publishDate: '2023-12-10',
                readTime: '6 min',
                image: 'assets/images/tips/winter-skincare.jpg',
                featured: false,
                tags: ['winter', 'skincare', 'protection']
            },
            {
                id: '3',
                title: '5 Natural Ingredients for Hair Growth',
                excerpt: 'Boost your hair growth with these powerful natural ingredients.',
                category: 'haircare',
                author: 'James Wilson',
                publishDate: '2023-11-28',
                readTime: '5 min',
                image: 'assets/images/tips/hair-growth.jpg',
                featured: false,
                tags: ['haircare', 'growth', 'natural']
            },
            {
                id: '4',
                title: 'The 5-Minute Makeup Routine for Busy Mornings',
                excerpt: 'Look polished and put together even when you\'re short on time.',
                category: 'makeup',
                author: 'Maria Rodriguez',
                publishDate: '2023-11-15',
                readTime: '4 min',
                image: 'assets/images/tips/quick-makeup.jpg',
                featured: false,
                tags: ['makeup', 'quick', 'routine']
            },
            {
                id: '5',
                title: 'Understanding Your Skin Type: A Complete Guide',
                excerpt: 'Learn how to identify your skin type and choose the right products.',
                category: 'skincare',
                author: 'Dr. Emily Chen',
                publishDate: '2023-11-05',
                readTime: '7 min',
                image: 'assets/images/tips/skin-types.jpg',
                featured: false,
                tags: ['skincare', 'types', 'guide']
            },
            {
                id: '6',
                title: 'The Benefits of Double Cleansing',
                excerpt: 'Why this Korean beauty technique is essential for clear skin.',
                category: 'skincare',
                author: 'Maria Rodriguez',
                publishDate: '2023-10-20',
                readTime: '5 min',
                image: 'assets/images/tips/double-cleansing.jpg',
                featured: false,
                tags: ['cleansing', 'k-beauty', 'routine']
            }
        ];

        this.filteredTips = [...this.tips];
    }

    setupEventListeners() {
        // Category filters
        const categoryLinks = document.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                
                // Update active link
                categoryLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreTips');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreTips();
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.sidebar-newsletter');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletterForm);
            });
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        if (category === 'all') {
            this.filteredTips = [...this.tips];
        } else {
            this.filteredTips = this.tips.filter(tip => tip.category === category);
        }

        this.displayTips();
    }

    displayTips() {
        const tipsGrid = document.getElementById('tipsGrid');
        if (!tipsGrid) return;

        const startIndex = (this.currentPage - 1) * this.tipsPerPage;
        const endIndex = startIndex + this.tipsPerPage;
        const tipsToShow = this.filteredTips.slice(startIndex, endIndex);

        if (tipsToShow.length === 0) {
            tipsGrid.innerHTML = `
                <div class="no-tips" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-newspaper" style="font-size: 48px; color: #e2e8f0; margin-bottom: 20px;"></i>
                    <h3>No tips found</h3>
                    <p>Try selecting a different category</p>
                </div>
            `;
            return;
        }

        tipsGrid.innerHTML = tipsToShow.map(tip => this.createTipCard(tip)).join('');

        // Update load more button
        this.updateLoadMoreButton();
    }

    createTipCard(tip) {
        return `
            <article class="tip-card" data-tip-id="${tip.id}">
                <div class="tip-image">
                    <img src="${tip.image}" alt="${tip.title}">
                    <div class="tip-category">${this.getCategoryName(tip.category)}</div>
                </div>
                <div class="tip-content">
                    <h3>${tip.title}</h3>
                    <p class="tip-excerpt">${tip.excerpt}</p>
                    <div class="tip-meta">
                        <span class="author">By ${tip.author}</span>
                        <span class="date">${new Date(tip.publishDate).toLocaleDateString()}</span>
                        <span class="read-time">${tip.readTime}</span>
                    </div>
                    <a href="#" class="read-more" onclick="tipsManager.readTip('${tip.id}')">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    getCategoryName(categoryId) {
        const categories = {
            skincare: 'Skincare',
            haircare: 'Haircare',
            makeup: 'Makeup',
            wellness: 'Wellness',
            seasonal: 'Seasonal Care'
        };
        return categories[categoryId] || categoryId;
    }

    readTip(tipId) {
        const tip = this.tips.find(t => t.id === tipId);
        if (tip) {
            // In a real app, this would navigate to a full article page
            // For now, we'll show an alert
            alert(`Opening article: ${tip.title}`);
            // window.location.href = `tip-details.html?id=${tipId}`;
        }
    }

    loadMoreTips() {
        this.currentPage++;
        this.displayTips();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreTips');
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredTips.length / this.tipsPerPage);
        
        if (this.currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Successfully subscribed to beauty insights!', 'success');
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

    // Get featured tips for home page
    getFeaturedTips() {
        return this.tips.filter(tip => tip.featured).slice(0, 3);
    }

    // Get tips by category
    getTipsByCategory(category, limit = 3) {
        const filtered = category === 'all' ? this.tips : this.tips.filter(tip => tip.category === category);
        return filtered.slice(0, limit);
    }
}

// Initialize tips manager
document.addEventListener('DOMContentLoaded', function() {
    window.tipsManager = new TipsManager();
});
