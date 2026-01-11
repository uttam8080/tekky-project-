
class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <span class="toast-close"><i class="fas fa-times"></i></span>
        `;

        this.container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

const toast = new Toast();

// ============ MODAL/DIALOG SYSTEM ============
// Modal dialog class for displaying important information
class Modal {
    constructor(title, content, actions = []) {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.title = title;
        this.content = content;
        this.actions = actions;
        this.createModal();
    }

    createModal() {
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        let actionsHTML = '';
        if (this.actions.length > 0) {
            actionsHTML = this.actions.map(action => 
                `<button class="btn ${action.className || 'btn-secondary'}" data-action="${action.id}">${action.label}</button>`
            ).join('');
        }

        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${this.title}</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                ${this.content}
            </div>
            ${actionsHTML ? `<div class="modal-footer">${actionsHTML}</div>` : ''}
        `;

        this.modal.appendChild(modalContent);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());

        const buttons = this.modal.querySelectorAll('.modal-footer button');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = this.actions.find(a => a.id === e.target.dataset.action);
                if (action && action.callback) {
                    action.callback();
                }
                this.close();
            });
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        document.body.appendChild(this.modal);
        setTimeout(() => this.modal.classList.add('active'), 10);
    }

    close() {
        this.modal.classList.remove('active');
        setTimeout(() => this.modal.remove(), 300);
    }
}

// ============ LOADING SPINNER ============
// Loading spinner class for showing busy state
class LoadingSpinner {
    constructor(targetElement = null) {
        this.targetElement = targetElement || document.body;
        this.spinner = document.createElement('div');
        this.spinner.className = 'loading-spinner';
    }

    show() {
        this.spinner.classList.add('active');
        this.targetElement.appendChild(this.spinner);
    }

    hide() {
        this.spinner.classList.remove('active');
        if (this.spinner.parentElement) {
            this.spinner.remove();
        }
    }
}

// ============ INTERACTIVE ENHANCEMENTS ============

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        if (!button.classList.contains('ripple')) {
            button.classList.add('ripple');
        }

        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-animation');

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Smooth scroll navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Animate elements on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.restaurant-card, .category-card, .menu-item').forEach(el => {
        observer.observe(el);
    });
}

// Interactive search with feedback
function setupInteractiveSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.add('highlight');
        });

        input.addEventListener('blur', function() {
            this.classList.remove('highlight');
        });

        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
            } else {
                this.style.backgroundColor = '';
            }
        });
    });
}

// Confirm action with modal
function confirmAction(title, message, onConfirm, onCancel = null) {
    const modal = new Modal(title, message, [
        {
            id: 'confirm',
            label: 'Confirm',
            className: 'btn-primary',
            callback: onConfirm
        },
        {
            id: 'cancel',
            label: 'Cancel',
            className: 'btn-secondary',
            callback: onCancel
        }
    ]);
    modal.open();
}

// Show alert
function showAlert(title, message) {
    const modal = new Modal(title, message, [
        {
            id: 'ok',
            label: 'OK',
            className: 'btn-primary'
        }
    ]);
    modal.open();
}

// Shake element on error
function shakeElement(element) {
    element.classList.add('error-shake');
    setTimeout(() => element.classList.remove('error-shake'), 400);
}

// Pulse element on success
function pulseElement(element) {
    element.classList.add('success-check');
    setTimeout(() => element.classList.remove('success-check'), 600);
}

// Add counter animation to numbers
function animateCounter(element, endValue, duration = 1000) {
    const startValue = 0;
    const startTime = Date.now();

    const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(startValue + (endValue - startValue) * progress);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };

    updateValue();
}

// Add slide-in animation when loading page
function animatePageLoad() {
    const elements = document.querySelectorAll('.hero, .page-header, .restaurants-section');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize all interactive features
function initializeInteractiveUI() {
    addRippleEffect();
    setupSmoothScroll();
    setupScrollAnimations();
    setupInteractiveSearch();
    animatePageLoad();
    
    // Setup click feedback for cart buttons
    setupCartInteractions();
    
    // Setup quantity button interactions
    setupQuantityInteractions();
}

// Cart interactions
function setupCartInteractions() {
    const addToCartButtons = document.querySelectorAll('[onclick*="addToCart"], [onclick*="addItemToCart"]');
    
    addToCartButtons.forEach(btn => {
        const originalOnClick = btn.onclick;
        btn.addEventListener('click', function() {
            pulseElement(this);
            toast.success('Added to cart! 🎉', 2000);
        });
    });

    const removeButtons = document.querySelectorAll('[onclick*="removeFromCart"]');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toast.warning('Removed from cart', 2000);
        });
    });
}

// Quantity button interactions
function setupQuantityInteractions() {
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.color = 'var(--white)';
        });

        btn.addEventListener('mouseup', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
        });
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal.active');
            if (modal) {
                modal.classList.remove('active');
            }
        }

        // CTRL+K or CMD+K opens search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                toast.info('Search activated', 1000);
            }
        }
    });
}

// Performance monitoring with visual feedback
function setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 1000) {
                    console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                }
            }
        });
        
        try {
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
            console.log('Performance monitoring not available');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractiveUI);
} else {
    initializeInteractiveUI();
}

// Setup keyboard shortcuts after DOM loads
setupKeyboardShortcuts();
setupPerformanceMonitoring();
