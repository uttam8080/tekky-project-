

document.addEventListener('DOMContentLoaded', () => {
    initializeCartSidebar();
});

function initializeCartSidebar() {

    if (!document.getElementById('cartSidebar')) {
        const sidebarHTML = `
            <div class="cart-sidebar-overlay" id="cartSidebarOverlay"></div>
            <div class="cart-sidebar" id="cartSidebar">
                <div class="cart-sidebar-header">
                    <h3><i class="fas fa-shopping-basket"></i> Your Cart</h3>
                    <button class="close-cart-sidebar" id="closeCartSidebar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-sidebar-content" id="cartSidebarContent">
                    <!-- Items will be injected here -->
                </div>
                <div class="cart-sidebar-footer" id="cartSidebarFooter">
                    <!-- Totals and buttons -->
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    }


    setupSidebarEvents();
}

function setupSidebarEvents() {
    const cartBtn = document.querySelector('.cart-btn');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartSidebarOverlay');
    const closeBtn = document.getElementById('closeCartSidebar');

    if (cartBtn) {




        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();

            openCartSidebar();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCartSidebar);
    if (overlay) overlay.addEventListener('click', closeCartSidebar);
}

function openCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartSidebarOverlay');


    renderCartSidebarItems();

    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartSidebarOverlay');

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}


window.addEventListener('cartUpdated', () => {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        
        renderCartSidebarItems();
    }
});

async function renderCartSidebarItems() {
    const content = document.getElementById('cartSidebarContent');
    const footer = document.getElementById('cartSidebarFooter');

    if (!content) return;

    try {
        const cartData = await api.getUnifiedCart();
        const items = cartData.items || [];

        if (items.length === 0) {
            content.innerHTML = `
                <div class="cart-sidebar-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button onclick="closeCartSidebar()" class="btn btn-primary" style="margin-top: 15px;">Start Ordering</button>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }

        const format = (p) => typeof formatPrice === 'function' ? formatPrice(p) : '₹' + p;

        content.innerHTML = items.map(item => {
            const itemId = String(item.menuItemId || item.id);
            return `
                <div class="cart-sidebar-item">
                    <img src="${item.image || 'images/food-placeholder.jpg'}" class="cart-sidebar-item-img" alt="${item.name || 'Food'}">
                    <div class="cart-sidebar-item-details">
                        <div class="cart-sidebar-item-title">${item.name || (item.menuItem ? item.menuItem.name : 'Unknown')}</div>
                        <div class="cart-sidebar-item-price">${format(item.price)}</div>
                        <div class="cart-sidebar-item-controls">
                            <button class="cart-qty-btn" onclick="updateSidebarQty('${itemId}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button class="cart-qty-btn" onclick="updateSidebarQty('${itemId}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const tax = Math.ceil(subtotal * 0.05);
        const deliveryFee = 50;
        const total = subtotal + tax + deliveryFee;

        if (footer) {
            footer.style.display = 'block';
            footer.innerHTML = `
                <div class="cart-summary-mini">
                    <div class="cart-total-row"><span>Subtotal</span> <span>${format(subtotal)}</span></div>
                </div>
                <div class="cart-sidebar-actions">
                    <a href="cart.html" class="btn-view-cart">View Cart</a>
                    <a href="checkout.html" class="btn-checkout-sidebar">Checkout ${format(total)}</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error rendering sidebar:', error);
        content.innerHTML = '<p class="error-text">Failed to load cart</p>';
    }
}


window.updateSidebarQty = async function (itemId, change) {
    try {
        const cartData = await api.getUnifiedCart();
        const items = cartData.items || [];
        const item = items.find(i => String(i.menuItemId || i.id) === String(itemId));
        if (!item) return;

        const newQty = item.quantity + change;

        if (typeof updateQuantity === 'function') {
            await updateQuantity(itemId, newQty);
            
            await renderCartSidebarItems();
        } else {
            
            console.error('updateQuantity missing');
            if (newQty < 1) {
                await api.removeFromCart(itemId);
            } else {
                await api.updateCartItem(itemId, newQty);
            }
            window.dispatchEvent(new Event('cartUpdated'));
            
            await renderCartSidebarItems();
        }
    } catch (error) {
        console.error('Update sidebar error:', error);
    }
};

