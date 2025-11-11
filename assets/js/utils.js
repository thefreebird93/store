// Utility Functions
class NonaUtils {
    constructor() {
        this.cache = new Map();
        this.debounceTimers = new Map();
    }

    // DOM Utilities
    $(selector) {
        return document.querySelector(selector);
    }

    $$(selector) {
        return document.querySelectorAll(selector);
    }

    createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    }

    // Local Storage Utilities
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

    // Debounce Function
    debounce(func, wait, immediate = false) {
        const key = func.toString();

        return function executedFunction(...args) {
            const later = () => {
                this.debounceTimers.delete(key);
                if (!immediate) func.apply(this, args);
            };

            const callNow = immediate && !this.debounceTimers.has(key);
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(later, wait));

            if (callNow) func.apply(this, args);
        }.bind(this);
    }

    // Throttle Function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Format Currency
    formatCurrency(amount, currency = 'LE') {
        return new Intl.NumberFormat('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount) + ` ${currency}`;
    }

    // Format Date
    formatDate(date, locale = 'ar-EG') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Generate Unique ID
    generateId(prefix = '') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Validate Email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate Phone
    validatePhone(phone) {
        const re = /^01[0-2,5]{1}[0-9]{8}$/;
        return re.test(phone);
    }

    // Sanitize HTML
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Load Script Dynamically
    loadScript(src, async = true) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = async;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Load CSS Dynamically
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Image Lazy Loading
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.$$('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.$$('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Copy to Clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }

    // Share Content
    async shareContent(title, text, url) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url
                });
                return true;
            } catch (error) {

                return false;
            }
        } else {
            // Fallback: copy to clipboard
            return this.copyToClipboard(url);
        }
    }

    // Get Device Type
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    }

    // Check if Touch Device
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Smooth Scroll to Element
    smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Add Event Listener with Multiple Events
    addMultiEventListener(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler, options);
        });
    }

    // Remove Event Listener with Multiple Events
    removeMultiEventListener(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.removeEventListener(event, handler, options);
        });
    }

    // Toggle Class with Animation
    toggleClassWithAnimation(element, className, duration = 300) {
        element.classList.toggle(className);
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // Fade In Element
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);

            element.style.opacity = opacity.toString();

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Fade Out Element
    fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - progress / duration, 0);

            element.style.opacity = opacity.toString();

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(animate);
    }

    // Performance Monitoring
    measurePerformance(fn, name = 'Function') {
        const start = performance.now();
        const result = fn();
        const end = performance.now();

        return result;
    }

    // Error Boundary
    async errorBoundary(fn, fallback = null) {
        try {
            return await fn();
        } catch (error) {
            console.error('Error caught:', error);
            return fallback;
        }
    }

    // Cache with Expiry
    setCache(key, value, expiryMinutes = 60) {
        const expiry = Date.now() + (expiryMinutes * 60 * 1000);
        this.cache.set(key, { value, expiry });
    }

    getCache(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    // Batch DOM Updates
    batchUpdate(callback) {
        if (typeof callback !== 'function') return;

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Use DocumentFragment for batch DOM operations
            const fragment = document.createDocumentFragment();
            callback(fragment);
        });
    }

    // Generate QR Code
    generateQRCode(text, size = 128) {
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, text, { width: size }, (error) => {
            if (error) console.error('QR Code generation error:', error);
        });
        return canvas;
    }
}

// Initialize Utils
const utils = new NonaUtils();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}

// Simple i18n loader
async function loadLang(lang){
  try{
    const res = await fetch('/i18n/'+lang+'.json');
    const dict = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
  }catch(e){console.warn('i18n load failed', e);} 
}
// Auto-load based on browser language (fallback to ar)
document.addEventListener('DOMContentLoaded', ()=>{
  const lang = (navigator.language||'ar').startsWith('en') ? 'en' : 'ar';
  loadLang(lang);
});
