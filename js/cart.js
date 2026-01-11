
function displayCart() {
    const emptyCart = document.getElementById('cartItemsEmpty');
    const cartList = document.getElementById('cartItemsList');
    const orderSummary = document.getElementById('orderSummary');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartList.style.display = 'none';
        orderSummary.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartList.style.display = 'flex';
    orderSummary.style.display = 'block';

    // Get restaurant name
    const restaurantName = cart[0].restaurantName;

    // Display items
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-restaurant">${restaurantName}</div>
                <div>
                    <span class="cart-item-price">${formatPrice(item.price)}</span>
                    <span style="color: var(--text-light); margin-left: 10px;">x${item.quantity}</span>
                </div>
            </div>
            <div class="cart-item-actions">
                <div style="text-align: right;">
                    <div style="font-weight: bold; margin-bottom: 8px;">${formatPrice(item.price * item.quantity)}</div>
                </div>
                <button class="remove-btn" onclick="removeItemFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// ============ CART ITEM MANAGEMENT ============
// Remove specific item from cart
function removeItemFromCart(itemId) {
    removeFromCart(itemId);
    displayCart();
}

// ============ PRICING & SUMMARY ============
// Update order summary (subtotal, tax, delivery fee, total)
function updateCartSummary() {
    const totals = calculateTotals();
    const deliveryFee = 50;
    const newTotal = totals.subtotal + deliveryFee + totals.gst;

    document.getElementById('cartSubtotal').textContent = formatPrice(totals.subtotal);
    document.getElementById('cartDeliveryFee').textContent = formatPrice(deliveryFee);
    document.getElementById('cartGST').textContent = formatPrice(totals.gst);
    document.getElementById('cartDiscount').textContent = '-₹0';
    document.getElementById('cartTotal').textContent = formatPrice(newTotal);
}

// ============ PROMO CODES & DISCOUNTS ============
// Apply promotional discount code to cart
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.toUpperCase();

    const validCodes = {
        'FOODHUB50': { discount: 0.50, message: '50% off applied!' },
        'SAVE100': { discount: 100, message: '₹100 cashback applied!' },
        'WELCOME20': { discount: 0.20, message: '20% off applied!' }
    };

    if (validCodes[code]) {
        showNotification(validCodes[code].message);
        promoInput.value = '';
    } else {
        showNotification('Invalid promo code');
    }
}

// ============ PAGE INITIALIZATION ============
// Initialize cart page on load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});
