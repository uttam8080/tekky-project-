
function displayCheckoutItems() {
    const itemsContainer = document.getElementById('checkoutItems');

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div style="padding: 8px 0; border-bottom: 1px solid var(--light-color);">
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        </div>
    `).join('');

    updateCheckoutSummary();
}

// ============ ORDER PRICING ============
// Update order summary with totals and fees
function updateCheckoutSummary() {
    const totals = calculateTotals();
    const deliveryFee = 50;
    const newTotal = totals.subtotal + deliveryFee + totals.gst;

    document.getElementById('checkoutSubtotal').textContent = formatPrice(totals.subtotal);
    document.getElementById('checkoutDeliveryFee').textContent = formatPrice(deliveryFee);
    document.getElementById('checkoutGST').textContent = formatPrice(totals.gst);
    document.getElementById('checkoutDiscount').textContent = '-₹0';
    document.getElementById('checkoutTotal').textContent = formatPrice(newTotal);
}

// ============ ORDER PLACEMENT & VALIDATION ============
// Process and place the final order
function placeOrder() {
    // Validate delivery address form
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const postal = document.getElementById('postal').value.trim();

    if (!fullName || !phone || !email || !street || !city || !postal) {
        showNotification('Please fill all required fields');
        return;
    }

    // Validate phone number
    if (phone.length !== 10 || isNaN(phone)) {
        showNotification('Please enter a valid 10-digit phone number');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email');
        return;
    }

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Create order object
    const order = {
        orderId: 'ORD' + Date.now(),
        restaurant: cart[0].restaurantName,
        items: cart,
        deliveryAddress: {
            name: fullName,
            phone: phone,
            email: email,
            street: street,
            city: city,
            postal: postal,
            instructions: document.getElementById('instructions').value
        },
        paymentMethod: paymentMethod,
        totals: calculateTotals(),
        orderDate: new Date().toLocaleString(),
        estimatedDelivery: '30-40 mins'
    };

    // Save order
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    currentRestaurant = null;
    localStorage.removeItem('cart');
    localStorage.removeItem('currentRestaurant');
    updateCartCount();

    // Show success message
    showNotification('Order placed successfully!');

    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = 'order-confirmation.html?orderId=' + order.orderId;
    }, 1500);
}

// ============ INPUT VALIDATION ============
// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ PAGE INITIALIZATION ============
// Initialize checkout page on load
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();

    // Add real-time validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    const postalInput = document.getElementById('postal');
    if (postalInput) {
        postalInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });
    }
});
